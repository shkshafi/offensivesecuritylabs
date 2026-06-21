#!/usr/bin/env node
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);

// Check for flags
const isMajor = args.includes('-M');
const isNoTag = args.includes('-d');

// Remove flags from args for custom message
const filteredArgs = args.filter(arg => arg !== '-M' && arg !== '-d');
const customMessage = filteredArgs.join(' ');
const isCustomMessage = customMessage.length > 0;

// Generate timestamp
const now = new Date();
const day = now.getDate();
const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const month = monthNames[now.getMonth()];
const hours = now.getHours() % 12 || 12;
const minutes = now.getMinutes().toString().padStart(2, '0');
const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
const timestamp = `${day}${suffix} ${month} at ${hours}:${minutes} ${ampm} IST`;

// Combined commit message
let commitMessage;
if (isCustomMessage) {
  commitMessage = `${customMessage} (deploy: ${timestamp})`;
} else {
  commitMessage = `Deploy: ${timestamp}`;
}

// Determine version type from flags
let versionType = 'minor';
if (isMajor) {
  versionType = 'major';
} else if (isNoTag) {
  versionType = 'none';
}

console.log(`🚀 Deploying with message: "${commitMessage}"`);
console.log(`🏷️  Version type: ${versionType === 'none' ? 'no tag' : versionType}`);

function runCommand(command, options = {}) {
  return execSync(command, { stdio: 'inherit', ...options });
}

function getGitDir() {
  try {
    return execSync('git rev-parse --git-dir', { encoding: 'utf8' }).trim();
  } catch (err) {
    console.error('❌ Unable to resolve .git directory:', err.message);
    process.exit(1);
  }
}

function hasRunningGitProcess() {
  try {
    if (process.platform === 'win32') {
      const result = spawnSync('tasklist', ['/FI', 'IMAGENAME eq git.exe', '/FO', 'CSV', '/NH'], { encoding: 'utf8' });
      const output = (result.stdout || '').trim();
      return output.length > 0 && !output.startsWith('INFO:');
    }

    const result = spawnSync('pgrep', ['-x', 'git'], { encoding: 'utf8' });
    return result.status === 0 && (result.stdout || '').trim().length > 0;
  } catch (err) {
    return false;
  }
}

function ensureGitIndexLockClear() {
  const gitDir = getGitDir();
  const lockPath = path.resolve(gitDir, 'index.lock');

  if (!fs.existsSync(lockPath)) {
    return;
  }

  if (hasRunningGitProcess()) {
    console.error('❌ Git index is locked by another running git process. Finish or close that process, then rerun deploy.');
    console.error(`ℹ️ Lock file: ${lockPath}`);
    process.exit(1);
  }

  fs.unlinkSync(lockPath);
  console.log(`🧹 Removed stale git lock: ${lockPath}`);
}

function runGitCommand(command, { mutatesIndex = false, continueOnError = false } = {}) {
  try {
    if (mutatesIndex) {
      ensureGitIndexLockClear();
    }

    return runCommand(command);
  } catch (err) {
    if (mutatesIndex) {
      const gitDir = getGitDir();
      const lockPath = path.resolve(gitDir, 'index.lock');
      if (fs.existsSync(lockPath)) {
        console.error(`❌ Git index lock blocked command: ${command}`);
        console.error(`ℹ️ Lock file: ${lockPath}`);
      }
    }

    if (continueOnError) {
      return null;
    }

    throw err;
  }
}

// Install dependencies only when node_modules is missing
function ensureDependencies() {
  if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules present — skipping install');
    return;
  }

  console.log('📦 node_modules missing; installing packages');
  try {
    if (fs.existsSync('package-lock.json')) {
      runCommand('npm ci --legacy-peer-deps');
    } else {
      runCommand('npm install --legacy-peer-deps');
    }
  } catch (err) {
    console.error('❌ npm install failed:', err.message);
    process.exit(1);
  }
}
ensureDependencies();

// Build and commit changes (don't push yet)
try {
  // Verify Node.js and npm versions
  console.log(`🔧 Node.js ${execSync('node --version').toString().trim()}, npm ${execSync('npm --version').toString().trim()}`);

  // Run the builds; abort if any fail
  console.log('🏗️ Starting Vite build process...');
  runCommand('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Vite build completed successfully');

  console.log('🏗️ Starting Docusaurus build process...');
  runCommand('npm run docusaurus:build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Docusaurus build completed successfully');
} catch (err) {
  console.error('❌ Build failed — aborting deploy');
  console.error('Build Error Details:');
  console.error('Error Message:', err.message);
  console.error('Error Stack:', err.stack);
  
  process.exit(1);
}

// stage all changes
try {
  runGitCommand('git add .', { mutatesIndex: true });
} catch (err) {
  console.error('❌ git add failed:', err.message);
  process.exit(1);
}
// commit if there are staged changes; if commit fails because there is nothing to commit, continue
try {
  runGitCommand('git commit -m ' + JSON.stringify(commitMessage), { mutatesIndex: true });
  console.log('✅ Built and committed changes locally');
} catch (err) {
  console.log('ℹ️ Nothing to commit or commit failed — continuing deployment');
}

// Fetch latest tags from remote so we can compute next tag accurately
try {
  runGitCommand('git fetch --tags', { continueOnError: true });
} catch (err) {
  // non-fatal
}

// Smart versioning - get LATEST tag
const tagsResult = spawnSync('git', ['tag', '-l', 'v[0-9]*.[0-9]*', '--sort=-v:refname']);
const tags = tagsResult.stdout.toString().trim().split('\n').filter(Boolean);

let major, minor;
if (tags.length === 0) {
  major = 1;
  minor = 0;
} else {
  const latestTag = tags[0]; // e.g. "v2.0"
  [major, minor] = latestTag.slice(1).split('.').map(Number);
}

// Determine tag name based on version type
let tagName = null;
if (versionType === 'major') {
  tagName = `v${major + 1}.0`;
} else if (versionType === 'minor') {
  tagName = `v${major}.${minor + 1}`;
} else {
  console.log('⏭️  No tagging requested (-d flag)');
}

// Determine version to write to file (tag preferred)
let versionToWrite = null;
if (tagName) {
  versionToWrite = tagName;
} else if (tags && tags[0]) {
  versionToWrite = tags[0];
} else {
  try {
    versionToWrite = execSync('git rev-parse --short HEAD').toString().trim();
  } catch (err) {
    versionToWrite = null;
  }
}

if (versionToWrite) {
  const versionFile = 'public/version.txt';
  try {
    fs.writeFileSync(versionFile, versionToWrite + '\n', { encoding: 'utf8' });
    console.log(`✅ Wrote version to ${versionFile}: ${versionToWrite}`);
  } catch (err) {
    console.log('❌ Failed to write version file:', err.message);
  }

  // Update APP_VERSION in local .env (do not commit .env)
  const envFile = '.env';
  try {
    if (fs.existsSync(envFile)) {
      let envContents = fs.readFileSync(envFile, 'utf8');
      const re = /^APP_VERSION=.*$/m;
      if (re.test(envContents)) {
        envContents = envContents.replace(re, `APP_VERSION=${versionToWrite}`);
      } else {
        envContents = envContents + `\nAPP_VERSION=${versionToWrite}`;
      }
      fs.writeFileSync(envFile, envContents, { encoding: 'utf8' });
      console.log(`✅ Updated ${envFile} with APP_VERSION=${versionToWrite}`);
    } else {
      console.log(`ℹ️ ${envFile} not found; skipping .env update`);
    }
  } catch (err) {
    console.log('❌ Failed to update .env with APP_VERSION:', err.message);
  }

  // Commit the version file so production receives it on the same push
  try {
    runGitCommand(`git add ${versionFile}`, { mutatesIndex: true });
    runGitCommand(`git commit -m "chore: version ${versionToWrite}"`, { mutatesIndex: true });
    console.log('✅ Committed version file');
  } catch (err) {
    console.log('❌ Failed to commit version file:', err.message);
  }

  // If tagging was requested, create the annotated tag now on HEAD (which includes version file)
  if (tagName) {
    console.log(`\n📝 Tagging as ${tagName}...`);
    try {
      runGitCommand(`git tag -a ${tagName} -m "${commitMessage}"`);
      runGitCommand(`git push origin ${tagName}`);
      console.log(`✅ Tagged as ${tagName}! Ready for rollback.`);
    } catch (error) {
      console.log('❌ Tag failed:', error.message);
    }
  }

  // Push main (includes the version commit)
  try {
    runGitCommand('git push origin main');
    console.log('✅ Pushed main with version file');
  } catch (err) {
    console.log('❌ Failed to push main:', err.message);
  }

} else {
  console.log('ℹ️ No version available to write');
}

console.log('\n🎉 All done!');

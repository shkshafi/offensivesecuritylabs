#!/usr/bin/env node
const { execSync } = require('child_process');
const { spawnSync } = require('child_process');

// Get last 3 stable tags (v*.* format)
const tagsResult = spawnSync('git', ['tag', '-l', 'v*.*', '--sort=-v:refname']);
const tags = tagsResult.stdout.toString().trim().split('\n').slice(0, 3).filter(Boolean);

if (tags.length === 0) {
  console.log('❌ No stable tags (v*.*) found. Create with: git tag -a v1.0 -m "Stable v1.0"');
  process.exit(1);
}

console.log('\n🎯 Stable versions available:');
tags.forEach((tag, i) => console.log(`${i + 1}. ${tag}`));

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('\nSelect version to rollback (number): ', (choice) => {
  readline.close();

  const selectedIndex = parseInt(choice) - 1;
  if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= tags.length) {
    console.log('❌ Invalid selection');
    process.exit(1);
  }

  const selectedTag = tags[selectedIndex];
  console.log(`\n🔄 Rolling back to ${selectedTag}...`);

  // Execute rollback
  try {
    execSync(`git reset --hard ${selectedTag} && git clean -fd`, { stdio: 'inherit' });
    console.log(`✅ Rolled back to ${selectedTag}! App is now stable.`);
    console.log(`💡 Test: npm run dev`);
  } catch (error) {
    console.log('❌ Rollback failed:', error.message);
  }
});

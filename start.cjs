const { spawn, exec } = require('child_process');

console.log('Starting npm run dev...');
const devProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

console.log('Starting php artisan serve on port 8001...');
const artisanProcess = spawn('php', ['artisan', 'serve', '--port=8001'], { stdio: 'inherit', shell: true });

// Wait a brief moment for servers to spin up, then open Google Chrome
setTimeout(() => {
    console.log('Opening http://127.0.0.1:8001 in Google Chrome...');
    exec('open -a "Google Chrome" http://127.0.0.1:8001', (err) => {
        if (err) {
            console.warn('Could not open specifically with Google Chrome. Trying default browser open...', err.message);
            exec('open http://127.0.0.1:8001');
        }
    });
}, 1500);

// Ensure child processes are killed when the main process is terminated
const cleanExit = () => {
    console.log('\nShutting down development servers...');
    devProcess.kill('SIGTERM');
    artisanProcess.kill('SIGTERM');
    process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);

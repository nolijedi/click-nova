const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const fs = require('fs');
const config = require('./config');

// Function to check if a port is available
function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', () => resolve(false));
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        server.listen(port);
    });
}

// Function to find an available port
async function findAvailablePort(startPort, endPort) {
    for (let port = startPort; port <= endPort; port++) {
        if (await checkPort(port)) {
            return port;
        }
    }
    throw new Error(`No available ports found between ${startPort} and ${endPort}`);
}

// Function to write the port configuration
async function writePortConfig(backendPort, frontendPort) {
    const configPath = path.join(__dirname, 'runtime-config.json');
    const config = {
        backendPort,
        frontendPort,
        backendUrl: `http://localhost:${backendPort}`
    };
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
    return config;
}

// Function to start a process and log its output
function startProcess(command, args, cwd, name) {
    console.log(`Starting ${name} with command: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
        cwd: cwd,
        shell: true,
        stdio: 'pipe',
        env: { ...process.env }
    });

    process.stdout.on('data', (data) => {
        console.log(`[${name}] ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[${name}] ${data}`);
    });

    process.on('error', (error) => {
        console.error(`[${name}] Error: ${error.message}`);
    });

    process.on('close', (code) => {
        if (code !== 0) {
            console.error(`[${name}] Process exited with code ${code}`);
        }
    });

    return process;
}

async function main() {
    try {
        console.log('Starting Turbo Smooth Optimizer...');
        
        // Find available ports
        const backendPort = await findAvailablePort(
            config.defaultBackendPort,
            config.portRange.max
        );
        
        const frontendPort = await findAvailablePort(
            backendPort + 1,
            config.portRange.max
        );

        console.log(`Using ports - Backend: ${backendPort}, Frontend: ${frontendPort}`);

        // Write the runtime configuration
        const runtimeConfig = await writePortConfig(backendPort, frontendPort);
        
        // Get directories
        const rootDir = __dirname;
        const serverDir = path.join(rootDir, 'server');

        // Start the backend server with the selected port
        const backendProcess = startProcess(
            'node',
            ['server.js', backendPort.toString()],
            serverDir,
            'Backend'
        );

        // Wait for backend to start, then start frontend
        setTimeout(() => {
            const frontendProcess = startProcess(
                'npm',
                ['run', 'dev:frontend', '--', '--port', frontendPort.toString()],
                rootDir,
                'Frontend'
            );

            // Open the browser after both servers are running
            setTimeout(() => {
                const url = `http://localhost:${frontendPort}`;
                console.log(`\nOpening application at: ${url}`);
                const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
                spawn(start, [url], { shell: true });
            }, 3000);
        }, 2000);

        // Handle process termination
        process.on('SIGINT', () => {
            console.log('\nShutting down...');
            backendProcess.kill();
            process.exit();
        });
    } catch (error) {
        console.error('Failed to start:', error);
        process.exit(1);
    }
}

main();

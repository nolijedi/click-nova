const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create the download directory if it doesn't exist
const downloadDir = path.join(__dirname, 'download');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

// Create a write stream for our zip file
const output = fs.createWriteStream(path.join(downloadDir, 'TurboSmoothOptimizer.zip'));
const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
});

// Listen for errors
archive.on('error', function(err) {
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the required files
const filesToInclude = [
    'start.bat',
    'start.js',
    'config.js',
    'package.json',
    'server/server.js',
    'src',
    'public',
    'node_modules',
    'README.md'
];

filesToInclude.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            archive.directory(fullPath, file);
        } else {
            archive.file(fullPath, { name: file });
        }
    }
});

// Finalize the archive
archive.finalize();

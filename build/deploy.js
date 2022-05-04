const path = require("path");
const host = require("../.host.json");
const SFTPUpload = require('sftp-upload');

const parentDir = path.normalize(__dirname + "/..");

const config = {
    host: host.host,
    username: host.username,
    password: host.password,
    port: host.port,
    path: parentDir,
    remoteDir: host.directory,

    excludedFolders: ['.git', 'node_modules', 'build'],
    // Does not support blobs :-/
    exclude: [".DS_Store", ".host.json", "package-lock.json", "package.json", "README.md", ".gitignore"],
    
    dryRun: false,
};

const sftp = new SFTPUpload(config);
    sftp.on('error', function(err) {
        throw err;
    })
    .on('uploading', function(progress) {
        console.log(`${progress.percent}% ${progress.file}`);
    })
    .on('completed', function() {
        console.log('Upload Completed');
    })
    .upload();

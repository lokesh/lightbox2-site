const path = require("path");
const fs = require("fs");
const SftpClient = require("ssh2-sftp-client");
const host = require("../.host.json");

const parentDir = path.normalize(__dirname + "/..");

const excludedFolders = [".git", "node_modules", "build"];
const excludedFiles = [
  ".DS_Store",
  ".host.json",
  "package-lock.json",
  "package.json",
  "README.md",
  ".gitignore",
];

function getFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (!excludedFolders.includes(entry)) {
        results = results.concat(getFiles(fullPath));
      }
    } else if (!excludedFiles.includes(entry)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function deploy() {
  const sftp = new SftpClient();
  const files = getFiles(parentDir);

  console.log(`${files.length} files to upload.`);
  console.log(`Connecting to ${host.host}...`);

  try {
    await sftp.connect({
      host: host.host,
      port: host.port,
      username: host.username,
      password: host.password,
    });
    console.log("Connected.");

    for (let i = 0; i < files.length; i++) {
      const localFile = files[i];
      const relativePath = path.relative(parentDir, localFile);
      const remotePath = path.posix.join(host.directory, relativePath.split(path.sep).join("/"));
      const remoteDir = path.posix.dirname(remotePath);

      await sftp.mkdir(remoteDir, true);
      await sftp.put(localFile, remotePath);

      const percent = Math.round(((i + 1) / files.length) * 100);
      console.log(`${percent}% ${relativePath}`);
    }

    console.log("Upload completed.");
  } catch (err) {
    console.error("Deploy failed:", err.message);
    process.exit(1);
  } finally {
    await sftp.end();
  }
}

deploy();

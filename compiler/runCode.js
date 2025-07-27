// compiler/runCode.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const runCode = (language, code, input = '') => {
  return new Promise((resolve, reject) => {
    const filename = `${uuid()}.cpp`; // only cpp for now
    const filepath = path.join(tempDir, filename);

    fs.writeFileSync(filepath, code);

    const executable = filepath.replace('.cpp', '.out');

    const compile = `g++ ${filepath} -o ${executable}`;
    const run = `echo "${input}" | ${executable}`;

    exec(compile, (err, _, stderr) => {
      if (err) return reject(new Error(`Compilation error:\n${stderr}`));

      exec(run, (err, stdout, stderr) => {
        if (err) return reject(new Error(`Runtime error:\n${stderr}`));

        resolve(stdout);
        // Clean up files if needed
      });
    });
  });
};

module.exports = runCode;

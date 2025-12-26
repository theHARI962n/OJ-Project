// compiler/runCode.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const runCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    const filename = `${uuid()}.cpp`;
    const filepath = path.join(tempDir, filename);
    const executable = filepath.replace(".cpp", ".out");

    fs.writeFileSync(filepath, code);

    const compileCmd = `g++ ${filepath} -o ${executable}`;

    exec(compileCmd, (compileErr, _, compileStderr) => {
      if (compileErr) {
        return reject(new Error(`Compilation error:\n${compileStderr}`));
      }

      const runProcess = exec(executable, (runErr, stdout, stderr) => {
        if (runErr) {
          return reject(new Error(`Runtime error:\n${stderr}`));
        }
        resolve(stdout);
      });

      // ✅ Write input directly to stdin
      runProcess.stdin.write(input + "\n");
      runProcess.stdin.end();
    });
  });
};


module.exports = runCode;

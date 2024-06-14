import { exec } from "child_process";

export const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`Executing command: ${command}`);
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}\n${error}`);
        return reject(error);
      }
      if (stderr) {
        console.warn(`Warning from command: ${command}\n${stderr}`);
      }
      console.log(`Output from command: ${command}\n${stdout}`);
      resolve(stdout);
    });

    process.on("exit", (code) => {
      console.log(`Command "${command}" exited with code ${code}`);
    });
  });
};

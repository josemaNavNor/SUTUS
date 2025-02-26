import { spawn } from 'child_process';

class PythonExecutorService {
    async executeScript(scriptPath, filePath) {
        return new Promise((resolve, reject) => {
            const python = spawn('python', [scriptPath, filePath]);

            let output = '';
            let error = '';

            python.stdout.on('data', (data) => {
                output += data.toString();
            });

            python.stderr.on('data', (data) => {
                error += data.toString();
                console.error('Python script error:', error);
            });

            python.on('close', (code) => {
                if (code === 0) {
                    resolve(output); // Return labeled text on success
                } else {
                    reject(new Error(`Python script exited with code ${code}: ${error}`));
                }
            });
        });
    }
}

export default PythonExecutorService;


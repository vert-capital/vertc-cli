import { spawn } from 'child_process';
import chalk from 'chalk';

export const colors = {
  progress: '#4ca9c4',
  success: '#67d770',
  error: '#d76767',
};

export function processArgs(argv) {
  // Processa argumentos passados para o script
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace('--', '');
    const value = argv[i + 1];
    args[key] = value;
  }
  return args;
}

export function cloneRepository(repositoryUrl, directory, template) {
  return new Promise((resolve, reject) => {
    // Construa o comando de clone com base no diretório fornecido
    const command = `git clone ${repositoryUrl} ${directory}`;

    // Execute o comando de clone
    const process = spawn(command, { shell: true, stdio: 'inherit' });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(
          `${chalk
            .hex(colors.progress)
            .bold(`[${template}]:`)} Repositório clonado`
        );
        resolve();
      } else {
        console.error(
          `${chalk
            .hex(colors.error)
            .bold(`[${template}]:`)} Falha ao clonar o repositório.`
        );
        reject();
      }
    });
  });
}

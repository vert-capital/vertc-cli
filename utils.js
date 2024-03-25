import {
  spawn
} from 'child_process';
import chalk from 'chalk';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs';

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
    const process = spawn(command, {
      shell: true,
      stdio: 'inherit'
    });

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

export function templateVar(filePath, key, value) {

  // console.log(`Substituindo variável ${key} por ${value} em ${filePath}`);

  // Colocar desta maneira porque da forma antiga estava tendo brechas
  // Alguns ele não conseguia alterar. Dessa maneira alteração é 100% efetiva
  const content = fs.readFileSync(filePath, 'utf8');
  const result = content.replace(new RegExp(`${key}`, 'g'), value);
  fs.writeFileSync(filePath, result, 'utf8');

  // shell.sed('-i', key, value, filePath);
}

export function templateVars(filePath, keyValueList) {
  Object.entries(keyValueList).forEach(([key, value]) => {
    templateVar(filePath, key, value);
  });
}

// Função para clonar o template do projeto
export function cloneTemplate(gitUrl, destinationFolder) {
  const tempPath = shell.tempdir();

  // Define o caminho completo para o diretório do projeto
  const fullPath = path.join(tempPath, destinationFolder);
  // Verifica se o diretório já existe, caso contrário, cria-o
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
  }
  // Executa o comando git clone para clonar o repositório do template para o diretório do projeto
  shell.exec(`git clone ${gitUrl} ${fullPath}`);
  // Remove a pasta .git do diretório clonado, pois não é necessária para o projeto
  shell.rm('-rf', `${fullPath}/.git`);
  // Retorna o caminho completo para o diretório do projeto clonado
  return fullPath;
}

export function removeTemplateFolder(fullPath) {
  // Remove o diretório do template após a clonagem
  shell.rm('-rf', fullPath);
}

export function copy(source, destination, templateVarsParams) {
  shell.cp(source, destination);

  if (templateVarsParams) {
    templateVars(destination, templateVarsParams);
  }
}

export function insertText(filePath, newText, lineNumber = null, referenceText = null) {
  const content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');

  if (lineNumber !== null) {
    lines.splice(lineNumber, 0, newText);
  } else if (referenceText !== null) {
    const index = lines.findIndex(line => line.includes(referenceText));
    if (index !== -1) {
      lines.splice(index + 1, 0, newText);
    }
  }

  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent, 'utf8');
}
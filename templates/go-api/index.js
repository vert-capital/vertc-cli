import inquirer from 'inquirer';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { processArgs } from '../../utils.js';

async function main() {
  const args = processArgs(process.argv);
  const template = args.template;
  let folderName = args.repository_name;

  const urlGit = 'https://github.com/vert-capital/vertc-template-go.git';

  if (!folderName || !projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'folderName',
        message: 'Qual será o nome do repositório?',
      },
    ]);

    const results = answers;
    folderName = results.folderName;
    projectName = results.projectName;
  }

  if (!shell.which('git')) {
    console.error(
      `${chalk.red('[vert-cli]:')} Este script requer o Git instalado`
    );
    process.exit(1);
  }

  console.log(
    `${chalk.hex('#4ca9c4').bold(`[${template}]:`)} Criando projeto...`
  );

  shell.exec(`git clone ${urlGit} ${folderName}`);

  // Após clonar, remove a pasta .git do template clonado
  shell.rm('-rf', `${folderName}/.git`);

  // Caminho para o arquivo .env no novo projeto
  const envPath = path.join(process.cwd(), folderName, '.env');

  // Conteúdo para o arquivo .env
  const envContent = `SECRET_key=
AUTH_URL=
REDIRECT_FRONT=`;

  fs.writeFileSync(envPath, envContent);

  // Substitui placeholders no template clonado
  shell.sed('-i', '{{FOLDER_NAME}}', folderName, `${folderName}/package.json`);

  console.log(
    `${chalk
      .hex('#67d770')
      .bold(`[${template}]:`)} Projeto "${folderName}" criado com sucesso.`
  );
}

main();

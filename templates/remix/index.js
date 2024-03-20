import inquirer from 'inquirer';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { colors, processArgs, cloneRepository } from '../../utils.js';

async function main() {
  const args = processArgs(process.argv);
  const template = args.template || args.t || '';
  let folderName = args.repository_name || args.r || '';
  let projectName = args.project_name || '';
  let directory = args.directory || args.d || '';

  const urlGit = 'https://github.com/vert-capital/vertc-template-remix.git';

  if (!folderName || !projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'folderName',
        message: 'Qual será o nome do repositório?',
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'Qual será o nome do projeto?',
      },
      {
        type: 'input',
        name: 'directory',
        message: 'Qual diretório deseja criar?',
        default: (answers) => answers.folderName,
      },
    ]);

    const results = answers;
    folderName = results.folderName;
    projectName = results.projectName;
    directory = results.directory;
  }

  if (!shell.which('git')) {
    console.error(
      `${chalk.red('[vert-cli]:')} Este script requer o Git instalado`
    );
    process.exit(1);
  }

  console.log(
    `${chalk.hex(colors.progress).bold(`[${template}]:`)} Criando projeto...`
  );

  const finalDirectory =
    directory === '.' || directory === './' ? '.' : directory || folderName;

  try {
    await cloneRepository(urlGit, finalDirectory, template);
  } catch (error) {
    console.error('Ocorreu um erro:', error.message);
  }

  // shell.exec(`git clone ${urlGit} ${directory || folderName}`);

  // Após clonar, remove a pasta .git do template clonado
  shell.rm('-rf', `${finalDirectory}/.git`);

  // Caminho para o arquivo .env no novo projeto
  const envPath = path.join(process.cwd(), finalDirectory, '.env');

  // Conteúdo para o arquivo .env
  const envContent = `SESSION_SECRET=knismD?kJ%qjDs!II.#Fmir:$T-]
BASE_URL_API=https://api.ferias.hml.vert-tech.dev/api
AUTH_URL=https://api.ferias.vert-capital.app/accounts/login
TOKEN_ONLY_DEV=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzgzNTA5NjU5LCJpYXQiOjE3MTA5MzM2NTksImp0aSI6Ijk5OWI2MTgyZmFiYTQ3ZTE5ZGE2OGNjZTUwMmMwOGFiIiwiZW1haWwiOiJkZW5pc3Nvbi5jYXJ2YWxob0B2ZXJ0LWNhcGl0YWwuY29tIn0.HXEZpLNXGh9WDxB0A-vkq7-FVql327gOWcj3WGWbWh4
REFRESH_TOKEN_ONLY_DEV=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxMTAyMDA1OSwiaWF0IjoxNzEwOTMzNjU5LCJqdGkiOiJlMjhiZDg4YTZhYTY0YjcyODQ1NThiOTBiYmQ1OTU3NiIsImVtYWlsIjoiZGVuaXNzb24uY2FydmFsaG9AdmVydC1jYXBpdGFsLmNvbSJ9.nRU3k29LAJHiQbm7kA89pBrJ18AwsDaDsjGWZynByC4`;

  fs.writeFileSync(envPath, envContent);

  // Substitui placeholders no template clonado
  shell.sed(
    '-i',
    '{{FOLDER_NAME}}',
    folderName,
    `${finalDirectory}/package.json`
  );
  shell.sed(
    '-i',
    '{{PROJECT_NAME}}',
    projectName,
    `${finalDirectory}/README.md`
  );
  shell.sed(
    '-i',
    '{{FOLDER_NAME}}',
    folderName,
    `${finalDirectory}/app/sessions.server.ts`
  );
  shell.sed(
    '-i',
    '{{FOLDER_NAME}}',
    folderName,
    `${finalDirectory}/app/cookies.server.ts`
  );
  shell.sed(
    '-i',
    '{{PROJECT_NAME}}',
    projectName,
    `${finalDirectory}/app/common/config.ts`
  );

  console.log(
    `${chalk
      .hex(colors.success)
      .bold(`[${template}]:`)} Projeto "${folderName}" criado com sucesso.`
  );
}

main();

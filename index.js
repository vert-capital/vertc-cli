#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';
import { colors } from './utils.js';

// Replicando __dirname e __filename em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('template', {
      alias: 't',
      describe: 'Escolha o template do projeto',
      type: 'string',
      demandOption: false, // Torna o argumento obrigatório
    })
    .option('repository_name', {
      alias: 'r',
      describe: 'Escolha o nome do repositório',
      type: 'string',
      demandOption: false, // Torna o argumento obrigatório
    })
    .option('generate', {
      alias: 'g',
      describe: 'Escolha uma estrutura',
      type: 'string',
      demandOption: false, // Torna o argumento obrigatório
    })
    .option('directory', {
      alias: 'd',
      describe: 'Escolha o local onde será criado o projeto',
      type: 'string',
      demandOption: false, // Torna o argumento obrigatório
    }).argv;

  const template = argv.template;
  const generate = argv.generate;

  // check template file exist
  const templateScriptExist = fs.existsSync(
    path.join(__dirname, 'templates', template, `index.js`)
  );
  if (!templateScriptExist) {
    console.error(
      `${chalk.red(
        `[vert-cli]:`
      )} Template "${template}" não encontrado. Os templates disponíveis são: ${fs
        .readdirSync(path.join(__dirname, 'templates'))
        .map((file) => file)
        // .map((file) => file.replace('.js', ''))
        .join(', ')}`
    );
    process.exit(1);
  }

  const templateScriptPath = path.join(
    __dirname,
    'templates',
    template,
    `index.js`
  );
  // Converte o objeto argv em uma string de argumentos de linha de comando
  const args = Object.entries(argv).flatMap(([key, value]) => [
    `--${key}`,
    value,
  ]);

  // Executa o script do template com Node.js, passando os argumentos necessários
  const child = spawn('node', [templateScriptPath, ...args], {
    stdio: 'inherit',
  });

  child.on('error', (err) => {
    console.error(
      `${chalk.bgHex(colors.progress).bold(`[${template}]:`)} ${err.message}`
    );
  });

  // child.on('exit', (code) => {
  //   console.log(
  //     `${chalk.bgHex('#4c51c4').bold(`${template}:`)} Script executado!`
  //   );
  // });
}

main();

import inquirer from 'inquirer';
import shell from 'shelljs';
import fs from 'fs';
import chalk from 'chalk';
import {
  processArgs,
  cloneTemplate,
  copy,
  insertText,
  removeTemplateFolder
} from '../../utils.js';

const GIT_URL = 'https://github.com/akaytatsu/template_golang.git';
const ERROR_GIT_NOT_FOUND = `${chalk.red('[vert-cli]:')} Este script requer o Git instalado`;

async function askForMissingArguments(args) {
  // if (!args.projectName) {
  //   args.projectName = await askQuestion('input', 'projectName', 'Qual será o nome do repositório?');
  // }
}

async function askQuestion(type, name, message, choices = []) {
  const answers = await inquirer.prompt([{
    type,
    name,
    message,
    choices
  }]);
  return answers[name];
}

// Função para verificar os pré-requisitos
function checkPrerequisites() {
  // Verifica se o Git está instalado
  if (!shell.which('git')) {
    console.error(ERROR_GIT_NOT_FOUND);
    process.exit(1);
  }
}

// Função para configurar o projeto
function setupProject(template, args, fullPath) {
  console.log(`${chalk.hex('#4ca9c4').bold(`[${template}]:`)} Criando projeto...`);
  const mainFolderName = "./";
  execute(mainFolderName, fullPath, args);
  console.log(`${chalk.hex('#67d770').bold(`[${template}]:`)} Projeto "${mainFolderName}" criado com sucesso.`);
}

function execute(mainFolderName, fullPath, args) {
  shell.exec(`rm -rf ${fullPath}/.git/`);
  shell.exec(`cp -r ${fullPath}/* ${mainFolderName}`);
  shell.exec(`cp -r ${fullPath}/.gitignore ${mainFolderName}.gitignore`);
  shell.exec(`cp ${fullPath}/src/.env.sample ${mainFolderName}src/.env`);
}

// Função principal assíncrona
async function main() {
  // Processa os argumentos da linha de comando
  const args = processArgs(process.argv);
  // Verifica os pré-requisitos
  checkPrerequisites();
  // Pergunta pelos argumentos faltantes
  // await askForMissingArguments(args);
  // Clona o template do projeto
  const fullPath = cloneTemplate(GIT_URL, "golang-template");
  // Configura o projeto
  setupProject(args.template, args, fullPath);

  // remove pasta do template
  removeTemplateFolder(fullPath);
}

main();
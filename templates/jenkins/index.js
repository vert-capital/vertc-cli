import inquirer from 'inquirer';
import shell from 'shelljs';
import fs from 'fs';
import chalk from 'chalk';
import {
    processArgs,
    templateVars,
    cloneTemplate,
    removeTemplateFolder
} from '../../utils.js';

const GIT_URL = 'https://github.com/vert-capital/template-jenkins.git';
const ERROR_GIT_NOT_FOUND = `${chalk.red('[vert-cli]:')} Este script requer o Git instalado`;

async function askForMissingArguments(args) {
    if (!args.kube_projectname) {
        args.kube_projectname = await askQuestion('input', 'kube_projectname', 'Nome do projeto');
    }
    if (!args.kube_projecttype) {
        args.kube_projecttype = await askQuestion('list', 'kube_projecttype', 'Escolha o tipo do projeto', ['remix', 'golang', 'django']);
    }
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
    const templateVarsData = {
        '{{ENVIRONMENT}}': args.kube_environment,
        '{{PROJECT_NAME}}': args.kube_projectname,
    }

    // Copia os arquivos específicos baseados no tipo de projeto
    switch (args.kube_projecttype) {
        case 'remix':
            shell.mv(`${fullPath}/Jenkinsfile-remix`, `./Jenkinsfile`);
            break;
        case 'golang':
            shell.mv(`${fullPath}/Jenkinsfile-golang`, `./Jenkinsfile`);
            break;
        case 'django':
            shell.mv(`${fullPath}/Jenkinsfile-django`, `./Jenkinsfile`);
            break;
        default:
            console.error(`${chalk.red('Tipo de projeto não suportado:')} ${args.kube_projecttype}`);
            process.exit(1);
    }

    // aplica as variáveis de template no arquivo Jenkinsfile
    templateVars("./Jenkinsfile", templateVarsData);
}

// Função principal assíncrona
async function main() {
    // Processa os argumentos da linha de comando
    const args = processArgs(process.argv);
    // Verifica os pré-requisitos
    checkPrerequisites();
    // Pergunta pelos argumentos faltantes
    await askForMissingArguments(args);
    // Clona o template do projeto
    const fullPath = cloneTemplate(GIT_URL, args.kube_projectname);
    // Configura o projeto
    setupProject(args.template, args, fullPath);

    // remove pasta do template
    removeTemplateFolder(fullPath);
}

main();
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

const GIT_URL = 'https://github.com/vert-capital/template-kubernetes.git';
const ERROR_GIT_NOT_FOUND = `${chalk.red('[vert-cli]:')} Este script requer o Git instalado`;

async function askForMissingArguments(args) {
    if (!args.kube_environment) {
        args.kube_environment = await askQuestion('list', 'kube_environment', 'Escolha o ambiente', ['prd', 'stg', 'hml']);
    }
    if (!args.kube_projectname) {
        args.kube_projectname = await askQuestion('input', 'kube_projectname', 'Nome do projeto');
    }
    if (!args.kube_projecttype) {
        args.kube_projecttype = await askQuestion('list', 'kube_projecttype', 'Escolha o tipo do projeto', ['remix', 'golang', 'django']);
    }
    await askForEndpointIfNeeded(args);
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

// Função assíncrona para perguntar pelo endpoint, se necessário
async function askForEndpointIfNeeded(args) {
    // Verifica se o endpoint do backend não foi fornecido e se o tipo de projeto é 'golang' ou 'django'
    if (!args.kube_backendendpoint && ['golang', 'django'].includes(args.kube_projecttype)) {
        // Pergunta pelo endpoint do backend
        args.kube_backendendpoint = await askQuestion('input', 'kube_backendendpoint', 'Endpoint do backend');
    }
    // Verifica se o endpoint do frontend não foi fornecido e se o tipo de projeto é 'remix'
    if (!args.kube_frontendendpoint && args.kube_projecttype === 'remix') {
        // Pergunta pelo endpoint do frontend
        args.kube_frontendendpoint = await askQuestion('input', 'kube_frontendendpoint', 'Endpoint do frontend');
    }
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
    const mainFolderName = args.kube_projectname + '-' + args.kube_environment;
    execute(mainFolderName, fullPath, args);
    console.log(`${chalk.hex('#67d770').bold(`[${template}]:`)} Projeto "${mainFolderName}" criado com sucesso.`);
}

function execute(mainFolderName, fullPath, args) {
    const templateVarsData = {
        '{{ENVIRONMENT}}': args.kube_environment,
        '{{PROJECT_NAME}}': args.kube_projectname,
        '{{BACKEND_ENDPOINT}}': args.kube_backendendpoint,
        '{{FRONTEND_ENDPOINT}}': args.kube_frontendendpoint,
    }

    // Verifica e cria a pasta do projeto principal se não existir
    if (!fs.existsSync(mainFolderName)) {
        fs.mkdirSync(mainFolderName);
    }

    // Copia os arquivos específicos baseados no tipo de projeto
    switch (args.kube_projecttype) {
        case 'remix':
            copyAndPrepare('remix-frontend', mainFolderName, fullPath, args.kube_frontendendpoint);
            break;
        case 'golang':
            copyAndPrepare('golang-backend', mainFolderName, fullPath, args.kube_backendendpoint);
            break;
        case 'django':
            copyAndPrepare('django-backend', mainFolderName, fullPath, args.kube_backendendpoint);
            break;
        default:
            console.error(`${chalk.red('Tipo de projeto não suportado:')} ${args.kube_projecttype}`);
            process.exit(1);
    }

    // renomeia o arquivo no diretorio argocd/apps/apps/sample.yaml para o nome do projeto
    let newName = args.kube_projectname + '-' + args.kube_environment;

    // copia o namespace da pasta base para a pasta do projeto
    shell.cp(`${fullPath}/base/namespace.yaml`, `${mainFolderName}/namespace.yaml`);

    // Move o arquivo YAML de configuração para o novo nome
    if (args.kube_environment === 'prd') {
        shell.mv(`${fullPath}/argocd/apps/apps/prd.yaml`, `argocd/apps/apps/${newName}.yaml`);
        // remove hml.yaml
        shell.rm(`argocd/apps/apps/hml.yaml`);
    } else {
        shell.mv(`${fullPath}/argocd/apps/apps/hml.yaml`, `argocd/apps/apps/${newName}.yaml`);
        // remove prd.yaml
        shell.rm(`argocd/apps/apps/prd.yaml`);
    }

    // busca todos os arquivos e altera as variaveis dentro do arquivo com as variaveis passadas
    // a pesquisa precisa ser recursiva e busca em todos os subdiretorios
    shell.ls('-Rl', mainFolderName).forEach(function (file) {
        if (file.isFile()) {
            templateVars(mainFolderName + "/" + file.name, templateVarsData);
        }
    });

    // Aplica as variáveis de template no arquivo YAML de configuração
    templateVars(`argocd/apps/apps/${newName}.yaml`, templateVarsData);


    // adiciona na ultima linha do arquivo argocd/gera_todos.sh o conteudo abaixo
    let content = `sh gera_todos.sh "${newName}" "${newName}/"`
    fs.appendFileSync(`argocd/gera_todos.sh`, content);
}

function copyAndPrepare(projectTypeDirectory, mainFolderName, fullPath, endpoint) {
    const sourcePath = `${fullPath}/${projectTypeDirectory}/*`;
    shell.cp('-R', sourcePath, mainFolderName);

    // Se o endpoint não for fornecido, remove o arquivo de ingresso correspondente
    if (!endpoint || endpoint === '') {
        if (projectTypeDirectory === 'remix-frontend') {
            shell.rm('-rf', `${mainFolderName}/frontend/new_ingress.yaml`);
        } else {
            shell.rm('-rf', `${mainFolderName}/backend/new_ingress.yaml`);
        }
    }
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
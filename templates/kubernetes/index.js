import inquirer from 'inquirer';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    processArgs,
    templateVars
} from '../../utils.js';

async function main() {
    const args = processArgs(process.argv);
    const template = args.template;
    let kube_environment = args.kube_environment;
    let kube_projectname = args.kube_projectname;
    let kube_backendendpoint = args.kube_backendendpoint;
    let kube_frontendendpoint = args.kube_frontendendpoint;
    let kube_projecttype = args.kube_projecttype;

    const templateVarsData = {
        '{{ENVIRONMENT}}': kube_environment,
        '{{PROJECT_NAME}}': kube_projectname,
        '{{BACKEND_ENDPOINT}}': kube_backendendpoint,
        '{{FRONTEND_ENDPOINT}}': kube_frontendendpoint,
    }

    const urlGit = 'https://github.com/vert-capital/template-kubernetes.git';

    if (!kube_environment) {
        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'kube_environment',
            message: 'Escolha o ambiente',
            choices: ['prd', 'stg', 'hml'],
        }, ]);

        const results = answers;
        kube_environment = results.kube_environment;
    }

    if (!kube_projectname) {
        const answers = await inquirer.prompt([{
            type: 'input',
            name: 'kube_projectname',
            message: 'Nome do projeto',
        }, ]);

        const results = answers;
        kube_projectname = results.kube_projectname;
    }

    if (!kube_projecttype) {
        const answers = await inquirer.prompt([{
            type: 'list',
            name: 'kube_projecttype',
            message: 'Escolha o tipo do projeto',
            choices: ['remix', 'golang', 'django'],
        }, ]);

        const results = answers;
        kube_projecttype = results.kube_projecttype;
    }

    if (!kube_backendendpoint && (kube_projecttype === 'golang' || kube_projecttype === 'django')) {
        const answers = await inquirer.prompt([{
            type: 'input',
            name: 'kube_backendendpoint',
            message: 'Endpoint do backend',
        }, ]);

        const results = answers;
        kube_backendendpoint = results.kube_backendendpoint;
    }

    if (!kube_frontendendpoint && kube_projecttype === 'remix') {
        const answers = await inquirer.prompt([{
            type: 'input',
            name: 'kube_frontendendpoint',
            message: 'Endpoint do frontend',
        }, ]);

        const results = answers;
        kube_frontendendpoint = results.kube_frontendendpoint;
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

    // caminho pasta temporaria do sistema operacional para clonar o template
    // get temp path from OS
    const tempPath = shell.tempdir();

    // Nome da pasta do projeto
    const fullPath = path.join(tempPath, kube_projectname);

    // se pasta não existe cria
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
    }

    shell.exec(`git clone ${urlGit} ${fullPath}`);

    // Após clonar, remove a pasta .git do template clonado
    shell.rm('-rf', `${fullPath}/.git`);

    let mainFolderName = kube_projectname + '-' + kube_environment;

    // verifica se existe a pasta mainFolderName
    if (!fs.existsSync(mainFolderName)) {
        fs.mkdirSync(mainFolderName);
    }

    if (kube_projecttype === 'remix') {
        shell.cp('-R', `${fullPath}/remix-frontend/*`, mainFolderName);

        if (kube_frontendendpoint === '') {
            // deleta o arquivo new_inress.yaml
            shell.rm('-rf', `${mainFolderName}/remix-frontend/new_inress.yaml`);
        }
    } else if (kube_projecttype === 'golang') {
        shell.cp('-R', `${fullPath}/golang-backend/*`, mainFolderName);

        if (kube_backendendpoint === '') {
            // deleta o arquivo new_inress.yaml
            shell.rm('-rf', `${mainFolderName}/golang-backend/new_inress.yaml`);
        }
    } else if (kube_projecttype === 'django') {
        shell.cp('-R', `${fullPath}/django-backend/*`, mainFolderName);

        if (kube_backendendpoint === '') {
            // deleta o arquivo new_inress.yaml
            shell.rm('-rf', `${mainFolderName}/django-backend/new_inress.yaml`);
        }
    }

    // renomeia o arquivo no diretorio argocd/apps/apps/sample.yaml para o nome do projeto
    let newName = kube_projectname + '-' + kube_environment;
    shell.cp('-R', `${fullPath}/argocd/apps/apps/prd.yaml`, "argocd/apps/apps/");

    if (kube_environment === 'prd') {
        shell.mv(`argocd/apps/apps/prd.yaml`, `argocd/apps/apps/${newName}.yaml`);
    } else {
        shell.mv(`argocd/apps/apps/hml.yaml`, `argocd/apps/apps/${newName}.yaml`);
    }

    // busca todos os arquivos e altera as variaveis dentro do arquivo com as variaveis passadas
    // a pesquisa precisa ser recursiva e busca em todos os subdiretorios
    shell.ls('-Rl', mainFolderName).forEach(function (file) {
        if (file.isFile()) {
            templateVars(mainFolderName + "/" + file.name, templateVarsData);
        }
    });

    templateVars(`argocd/apps/apps/${newName}.yaml`, templateVarsData);


    // adiciona na ultima linha do arquivo argocd/gera_todos.sh o conteudo abaixo
    let content = `sh gera_todos.sh "${newName}" "${newName}/"`
    fs.appendFileSync(`argocd/gera_todos.sh`, content);

    console.log(
        `${chalk
      .hex('#67d770')
      .bold(`[${template}]:`)} Projeto "${mainFolderName}" criado com sucesso.`
    );
}

main();
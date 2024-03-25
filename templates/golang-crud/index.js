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

const GIT_URL = 'https://github.com/vert-capital/golang-cleanarc-crud.git';
const ERROR_GIT_NOT_FOUND = `${chalk.red('[vert-cli]:')} Este script requer o Git instalado`;

async function askForMissingArguments(args) {
    if (!args.entity) {
        args.entity = await askQuestion('input', 'entity', 'Nome da entidade');
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
    const mainFolderName = "./src/";
    execute(mainFolderName, fullPath, args);
    console.log(`${chalk.hex('#67d770').bold(`[${template}]:`)} Projeto "${mainFolderName}" criado com sucesso.`);
}

function execute(mainFolderName, fullPath, args) {

    const entityLowerCase = args.entity.toLowerCase();
    // somente a primeira letra em maiusculo
    const entityUpCase = entityLowerCase.charAt(0).toUpperCase() + entityLowerCase.slice(1);

    const templateVarsData = {
        '{{entityLowerCase}}': entityLowerCase,
        '{{entityUpCase}}': entityUpCase,
    }

    // Verifica e cria a pasta do projeto principal se não existir
    if (!fs.existsSync(mainFolderName)) {
        // lança exceção pois a pasta não existe
        console.error(`${chalk.red('Pasta do projeto não encontrada:')} ${mainFolderName}`);
        process.exit(1);
    }

    // copia o namespace da pasta base para a pasta do projeto
    copy(`${fullPath}/api/handlers/handlers_entity.go`,
        `${mainFolderName}api/handlers/entity_${entityLowerCase}.go`,
        templateVarsData);

    copy(`${fullPath}/entity/entity_template.go`,
        `${mainFolderName}/entity/entity_${entityLowerCase}.go`,
        templateVarsData);
    copy(`${fullPath}/infrastructure/repository/repository_entity.go`,
        `${mainFolderName}/infrastructure/repository/repository_${entityLowerCase}.go`,
        templateVarsData);

    // cria a pasta ./src/usecase/entity
    shell.mkdir('-p', `${mainFolderName}/usecase/${entityLowerCase}`);

    copy(`${fullPath}/usecase/entity/usecase_entity_interface.go`,
        `${mainFolderName}/usecase/${entityLowerCase}/usecase_${entityLowerCase}_interface.go`,
        templateVarsData);
    copy(`${fullPath}/usecase/entity/usecase_entity_service.go`,
        `${mainFolderName}/usecase/${entityLowerCase}/usecase_${entityLowerCase}_service.go`,
        templateVarsData);

    const imports = `	usecase_carros "app/usecase/carros"`

    const migrateAdd = `	db.AutoMigrate(&entity.Entity${entityUpCase}{})`
    const apiHandlerVarsAdd = `

	var usecase${entityUpCase} usecase_${entityLowerCase}.IUsecase${entityUpCase} = usecase_${entityLowerCase}.NewService(
		repository.New${entityUpCase}Postgres(conn),
	)
`

    const apiHandlerAdd = `	handlers.Mount${entityUpCase}Routes(r, conn, usecase${entityUpCase})`

    insertText("./src/infrastructure/postgres/postgres.go", migrateAdd, null, "db.AutoMigrate(&entity.EntityUser{})");
    insertText("./src/api/api.go", apiHandlerVarsAdd, null, "r.Use(gin.Recovery())");
    insertText("./src/api/api.go", apiHandlerAdd, null, "handlers.MountUsersHandlers(r, conn)");
    insertText("./src/api/api.go", imports, null, "\"app/api/handlers\"");

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
    const fullPath = cloneTemplate(GIT_URL, "golang-cleanarc-crud");
    // Configura o projeto
    setupProject(args.template, args, fullPath);

    // remove pasta do template
    removeTemplateFolder(fullPath);
}

main();
import {fileURLToPath} from "url";
import path from "node:path";
import fs from "fs";
import {resolve} from "path";

export async function getDeployCommands()  {
    const commands = []
    return browsCommandsFiles(commands,(commands, commandDefault) => {
        commands.push(commandDefault.data.toJSON());
    })
}

export async function loadCommands() {
    const commands = {}
    return browsCommandsFiles(commands,(commands, commandDefault) => {
        commands[commandDefault.data.name] = commandDefault
    })
}

async function browsCommandsFiles(commands, action) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = await import("file://" + resolve(filePath));
            const {default: commandDefault} = command
            if (commandDefault.hasOwnProperty("data") && commandDefault.hasOwnProperty("execute")) {
                action(commands, commandDefault)
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    return commands
}
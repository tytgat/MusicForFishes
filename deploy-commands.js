import {REST, Routes} from "discord.js";

import {fileURLToPath} from 'url';
import {resolve} from 'path';
import fs from "node:fs";

import path from "node:path";
import config from "./config/bot.js";

const {clientId, guildId, token_bot} = config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import("file://" + resolve(filePath));
        const {default: commandDefault} = command
        if (commandDefault.hasOwnProperty("data") && commandDefault.hasOwnProperty("execute")) {
            commands.push(commandDefault.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token_bot);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {body: commands},
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
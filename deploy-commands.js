import {REST, Routes} from "discord.js";

import config from "./config/bot.js";
import {getDeployCommands} from "./utilities/fileLoader.js";

const {clientId, guildId, token_bot} = config
const commands = await getDeployCommands()

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
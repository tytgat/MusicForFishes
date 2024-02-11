import {Client, Events, GatewayIntentBits} from "discord.js";
import {createAudioPlayer} from "@discordjs/voice";

// @ts-ignore
import config from "./config/bot.js";
// @ts-ignore
import {loadCommands} from "./utilities/fileLoader.js";

async function main() {
    const {token_bot} = config

    const client = new Client({
        intents: [GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages
        ]
    });

    const player = createAudioPlayer();
    const commands = await loadCommands();

    client.once(Events.ClientReady, readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const command = commands[interaction.commandName];

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction, player);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
            } else {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    });

    await client.login(token_bot);
}

main();
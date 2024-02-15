import {Client, Events, GatewayIntentBits, Interaction} from "discord.js";
import {createAudioPlayer} from "@discordjs/voice";

// @ts-ignore
import config from "./config/bot.js";
// @ts-ignore
import {loadCommands} from "./utilities/fileLoader.js";
import {playMusic} from "./utilities/playMusic.js";
import {ACTION, CommandReturnType} from "./utilities/commandsTypes.js";

/**
 * TODO LIST
 * - /repeat
 * - playlist manager :O
 */

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
    const playlist: Array<{ url: string, channelId: string }> = [];

    player.addListener("stateChange", async (oldOne, newOne) => {
        // If idling and have next music in playlist, just play it !
        if (newOne.status == "idle") {
            if (playlist.length > 0) {
                const nextMusicData = playlist.shift()
                await playMusic(client, player, nextMusicData.url, nextMusicData.channelId)
            }
        }
    });

    client.once(Events.ClientReady, readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = commands[interaction.commandName];

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            const commandReturn: CommandReturnType = await command.execute(interaction, client, player);
            if (!commandReturn) {
                return;
            }
            if (commandReturn.action === ACTION.ADDTOPLAYLIST) {
                // Adding url to playlist
                playlist.push({url: commandReturn.data, channelId: interaction.channelId})
            }
            if (commandReturn.action === ACTION.STOP) {
                // Emptying playlist
                playlist.splice(0, playlist.length);
                player.stop(true)
            }
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
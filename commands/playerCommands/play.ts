import {Client, SlashCommandBuilder} from "discord.js";
import {AudioPlayer, AudioPlayerStatus, joinVoiceChannel} from "@discordjs/voice";
import {playMusic} from "../../utilities/playMusic.js";
import ytdl from "ytdl-core";
import {makeMessage, sendMessageToChannel} from "../../utilities/message.js";

import {ACTION, CommandReturnType} from "../../utilities/commandsTypes.js";

//https://github.com/fent/node-ytdl-core/issues/994#issuecomment-906581288
const play = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in your current voice channel')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Enter the YouTube URL or keywords to search for')
                .setRequired(true)),
    async execute(interaction: any, client: Client, player: AudioPlayer): Promise<CommandReturnType> {
        const url = interaction.options.getString('song');
        let channelId = interaction.channelId + "";

        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply({content: 'You are not in a voice channel!', ephemeral: true});
        }

        if (player && player.state) {
            //Resume player if paused
            if (player.state.status === AudioPlayerStatus.Paused) {
                await sendMessageToChannel(client, channelId, makeMessage('Orange', "Player is paused", {
                    description: "To resume the bot use the command /resume"
                }));
            }
            //If bot already playing, add return url to add it to the playlist by default
            if (player.state.status === AudioPlayerStatus.Playing || player.state.status === AudioPlayerStatus.Paused) {
                const videoInfo = await ytdl.getInfo(url);
                interaction.reply(makeMessage(
                    "DarkBlue",
                    "Adding to playlist", {
                        description: `[${videoInfo.videoDetails.title}](${url})`,
                        thumbnail: videoInfo.videoDetails.thumbnails[0].url
                    }));
                return {action:ACTION.ADDTOPLAYLIST,data:url}
            }

        }

        // Join the user's voice channel
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });


        // https://github.com/fent/node-ytdl-core/issues/902#issuecomment-1460991438
        try {
            // Subscribe the connection to the player
            connection.subscribe(player);
            interaction.reply(makeMessage("Orange", "Connecting..."));
            playMusic(client, player, url, channelId)
            return {action:ACTION.NONE}
        } catch (e) {
            console.log("ERROR::", e)
        }
    },
};

export default play;
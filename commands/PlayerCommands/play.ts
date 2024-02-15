import {Client, SlashCommandBuilder} from "discord.js";
import {AudioPlayer, AudioPlayerStatus, joinVoiceChannel} from "@discordjs/voice";
import {playMusic} from "../../utilities/playMusic.js";
import ytdl from "ytdl-core";
import {makeMessage} from "../../utilities/message.js";

//https://github.com/fent/node-ytdl-core/issues/994#issuecomment-906581288
const play = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in your current voice channel')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Enter the YouTube URL or keywords to search for')
                .setRequired(true)),
    async execute(interaction: any, client: Client, player: AudioPlayer) {
        const url = interaction.options.getString('song');

        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply({content: 'You are not in a voice channel!', ephemeral: true});
        }

        if (player && player.state) {
            if (player.state.status === AudioPlayerStatus.Playing) {
                const videoInfo = await ytdl.getInfo(url);
                interaction.reply(makeMessage(
                    "DarkBlue",
                    "Adding to playlist", {
                    description: `[${videoInfo.videoDetails.title}](${url})`,
                    thumbnail: videoInfo.videoDetails.thumbnails[0].url
                }));
                return url
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
            let channelId = interaction.channelId + "";
            playMusic(client, player, url, channelId)
            return ""
        } catch (e) {
            console.log("ERROR::", e)
        }
    },
};

export default play;
import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {createAudioPlayer, createAudioResource, joinVoiceChannel} from "@discordjs/voice";
import ytdl from "ytdl-core";

//https://github.com/fent/node-ytdl-core/issues/994#issuecomment-906581288
const play = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in your current voice channel')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Enter the YouTube URL or keywords to search for')
                .setRequired(true)),
    async execute(interaction) {
        const song = interaction.options.getString('song');

        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply({content: 'You are not in a voice channel!', ephemeral: true});
        }

        // Join the user's voice channel
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });


        // https://github.com/fent/node-ytdl-core/issues/902#issuecomment-1460991438
        try {
            // Get video info and create an audio resource
            const videoInfo = await ytdl.getInfo(song);
            const stream = ytdl(song, {
                filter: 'audioonly',
                fmt: 'mp3',
                highWaterMark: 1 << 30,
                liveBuffer: 20000,
                dlChunkSize: 4096,
                bitrate: 128,
                quality: 'lowestaudio'
            });
            const resource = createAudioResource(stream);

            // Create an audio player and play the resource
            const player = createAudioPlayer();
            player.play(resource);

            // Subscribe the connection to the player
            connection.subscribe(player);

            // Send a confirmation message
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle('Now Playing')
                .setDescription(`[${videoInfo.videoDetails.title}](${song})`)
                .setThumbnail(videoInfo.videoDetails.thumbnails[0].url);
            interaction.reply({embeds: [embed]});
        } catch (e) {
            console.log("ERROR::", e)
        }
    },
};

export default play;


// const player = createAudioPlayer();
// try {
// const stream = ytdl.exec(
//     song,
//     {
//         output: '-',
//         format:
//             'bestaudio[ext=webm+acodec=opus+tbr>100]/bestaudio[ext=webm+acodec=opus]/bestaudio/best',
//         limitRate: '1M',
//         rmCacheDir: true,
//         verbose: true,
//     },
//     { stdio: ['ignore', 'pipe', 'pipe'] }
// );
// const audioResource = createAudioResource(stream.stdout);
// player.play(audioResource);
// try {
//     //await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
//     connection.subscribe(player);
// } catch (error) {
//     connection.destroy();
// }} catch (err) {
//     console.log('ERROR', 'There was an error while trying to play the song.', err);
//
//     // return basicReply(this.message, `Ocorreu um erro ao tentar reproduzir o video!`, 'error');
// }


// player.play(interaction.member.voice.channel.id, song)
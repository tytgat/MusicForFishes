import {SlashCommandBuilder} from "discord.js";
import {joinVoiceChannel} from "@discordjs/voice";
import {playMusic} from "../../utilities/playMusic.js";

//https://github.com/fent/node-ytdl-core/issues/994#issuecomment-906581288
const play = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in your current voice channel')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Enter the YouTube URL or keywords to search for')
                .setRequired(true)),
    async execute(interaction: any, player: any) {
        const url = interaction.options.getString('song');

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
            // Subscribe the connection to the player
            connection.subscribe(player);

            playMusic(url, player, interaction)
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
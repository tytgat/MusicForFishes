import ytdl from "ytdl-core";
import {AudioPlayer, createAudioResource} from "@discordjs/voice";
import {EmbedBuilder} from "discord.js";

export async function playMusic(url: string, player: AudioPlayer, interaction: any) {
    // Get video info and create an audio resource
    const videoInfo = await ytdl.getInfo(url);
    const stream = ytdl(url, {
        filter: 'audioonly',
        // fmt: 'mp3',
        highWaterMark: 1 << 30,
        liveBuffer: 20000,
        dlChunkSize: 4096,
        // bitrate: 128,
        quality: 'lowestaudio'
    });
    const resource = createAudioResource(stream);

    // Create an audio player and play the resource
    player.play(resource);


    // Send a confirmation message
    const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle('Now Playing')
        .setDescription(`[${videoInfo.videoDetails.title}](${url})`)
        .setThumbnail(videoInfo.videoDetails.thumbnails[0].url);
    interaction.reply({embeds: [embed]});
}
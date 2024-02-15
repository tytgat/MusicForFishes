import ytdl from "ytdl-core";
import {AudioPlayer, createAudioResource} from "@discordjs/voice";
import {Channel, Client, EmbedBuilder, Snowflake, TextChannel} from "discord.js";
import {makeMessage} from "./message.js";

/**
 * Async function that get data from youtube
 * @param url url to the YT video
 * @return return info on the video and the stream of data to read it
 */
async function getYTResource(url: string) {
    const videoInfo = await ytdl.getInfo(url);
    const stream = ytdl(url, {
        filter: 'audioonly',
        highWaterMark: 1 << 30,
        liveBuffer: 20000,
        dlChunkSize: 4096,
        quality: 'lowestaudio'
    });
    const resource = createAudioResource(stream);
    return {videoInfo, resource};
}

export async function playMusic(client: Client, player: AudioPlayer, url: string, channelId: string) {
    // Get video info and create an audio resource
    const {videoInfo, resource} = await getYTResource(url);

    // Send a confirmation message
    if (client && channelId) {
        const channel: Channel = client.channels.cache.get(channelId + "")//.send("coucou")
        if (channel.isTextBased()) {
            const textChannel = channel as TextChannel
            await textChannel.send(makeMessage("Green", "Now Playing", {
                description: `[${videoInfo.videoDetails.title}](${url})`,
                thumbnail: videoInfo.videoDetails.thumbnails[0].url
            }))
        }
    }

    // Create an audio player and play the resource
    return player.play(resource);
}
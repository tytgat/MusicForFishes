import ytdl from "ytdl-core";
import {AudioPlayer, createAudioResource} from "@discordjs/voice";
import { Client} from "discord.js";
import {makeMessage, sendMessageToChannel} from "./message.js";

/**
 * Async function that get data from youtube
 * @param url url to the YT video
 * @return return info on the video and the stream of data to read it
 */
async function getYTResource(url: string) {
    try {
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
    } catch (e) {
        return {error: new Error(e).message}
    }
}


export async function playMusic(client: Client, player: AudioPlayer, url: string, channelId: string) {
    // Get video info and create an audio resource
    const {videoInfo, resource, error} = await getYTResource(url);
    if (error) {
        const message = makeMessage('Red', "An error occurred", {description: error})
        await sendMessageToChannel(client, channelId, message);
        return;
    }

    // Send a confirmation message
    if (client && channelId) {
        let message = makeMessage("Green", "Now Playing", {
            description: `[${videoInfo.videoDetails.title}](${url})`,
            thumbnail: videoInfo.videoDetails.thumbnails[0].url
        });
        await sendMessageToChannel(client, channelId, message);
    }

    // Create an audio player and play the resource
    return player.play(resource);
}
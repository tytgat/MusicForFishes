import {Channel, Client, ColorResolvable, EmbedBuilder, TextChannel} from "discord.js";


export async function sendMessageToChannel(client: Client, channelId: string, message: { embeds: EmbedBuilder[] }) {
    const channel: Channel = client.channels.cache.get(channelId + "")
    if (channel.isTextBased()) {
        const textChannel = channel as TextChannel

        await textChannel.send(message)
    }
}

export function makeMessage(color: ColorResolvable, title: string, options?: { description?: string, thumbnail?: string }) {
    const embed = new EmbedBuilder()
    embed.setColor(color)
    embed.setTitle(title)
    embed.setDescription(options?.description || null)
    embed.setThumbnail(options?.thumbnail || null)

    return {embeds: [embed]}
}
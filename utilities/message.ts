import {ColorResolvable, EmbedBuilder} from "discord.js";

export function makeMessage(color: ColorResolvable, title: string, options?: { description?: string, thumbnail?: string }) {
    const embed = new EmbedBuilder()
    embed.setColor(color)
    embed.setTitle(title)
    embed.setDescription(options?.description || null)
    embed.setThumbnail(options?.thumbnail || null)

    return {embeds: [embed]}
}
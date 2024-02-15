import {Client, SlashCommandBuilder} from "discord.js";
import {AudioPlayer} from "@discordjs/voice";
import {makeMessage} from "../../utilities/message.js";
import emojis from "../../config/emojis.js";

const stop = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop all musics'),
    async execute(interaction: any, client: Client, player: AudioPlayer) {
        player.stop(true)
        interaction.reply(makeMessage("Orange", "Stopping Music " + emojis.sabCarby))
    },
};

export default stop;

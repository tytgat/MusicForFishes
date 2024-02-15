import {Client, SlashCommandBuilder} from "discord.js";
import {AudioPlayer} from "@discordjs/voice";
import {makeMessage} from "../../utilities/message.js";

const pause = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause current music'),
    async execute(interaction: any, client: Client, player: AudioPlayer) {
        player.pause()
        interaction.reply(makeMessage("Orange", "Pausing..."))
    },
};

export default pause;

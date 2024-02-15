import {Client, SlashCommandBuilder} from "discord.js";
import {AudioPlayer, AudioPlayerStatus} from "@discordjs/voice";
import {makeMessage} from "../../utilities/message.js";

const skip = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current music'),
    async execute(interaction: any, client: Client, player: AudioPlayer) {
        if (player.state.status === AudioPlayerStatus.Playing || player.state.status === AudioPlayerStatus.Paused) {
            player.stop()
            interaction.reply(makeMessage("Blue", "Skipping..."))
        }
    },
};

export default skip;

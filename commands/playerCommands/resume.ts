import {Client, SlashCommandBuilder} from "discord.js";
import {AudioPlayer, AudioPlayerStatus} from "@discordjs/voice";
import {makeMessage} from "../../utilities/message.js";

const resume = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume paused music'),
    async execute(interaction: any, client: Client, player: AudioPlayer) {
        if (player.state.status === AudioPlayerStatus.Paused) {
            player.unpause()
            interaction.reply(makeMessage("Green", "Resuming music !"))
            return;
        }
        interaction.reply(makeMessage("Orange", "The player was not paused"))
    },
};

export default resume;

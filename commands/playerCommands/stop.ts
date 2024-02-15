import {Client, SlashCommandBuilder} from "discord.js";
import {AudioPlayer} from "@discordjs/voice";
import {makeMessage} from "../../utilities/message.js";
import emojis from "../../config/emojis.js";
import {ACTION, CommandReturnType} from "../../utilities/commandsTypes.js";

const stop = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop all musics'),
    async execute(interaction: any, client: Client, player: AudioPlayer): Promise<CommandReturnType> {
        interaction.reply(makeMessage("Red", "Stopping Music " + emojis.sabCarby))
        return {action:ACTION.STOP}
    },
};

export default stop;

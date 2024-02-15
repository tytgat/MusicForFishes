import {SlashCommandBuilder} from "discord.js";
import {makeMessage} from "../../utilities/message.js";


const ping = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies as a fish'),
    async execute(interaction: any) {
        await interaction.reply(makeMessage("Blue", "I am a fish", {description: "And that ... is THAT !"}));
    },
};

export default ping
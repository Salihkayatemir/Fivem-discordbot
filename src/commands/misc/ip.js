const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const config = require("../../../config.json");
module.exports = {
    name: 'ip',
    description: 'Shows the IP address of the server',
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const embed = new EmbedBuilder()
            .setColor(config.embed.renk)
            .setDescription(`> Server IP: **${config.sunucuIP}**`);
        interaction.editReply({embeds: [embed]});
    }
};
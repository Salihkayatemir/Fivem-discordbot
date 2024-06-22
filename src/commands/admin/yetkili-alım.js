const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const config = require("../../../config.json");
module.exports = {
    name: 'yetkilialım', // This is a mandatory option.
    description: 'Test Command', // This is a mandatory option.
    devOnly: true, // If this option is "true", only users in config.json>Admin can use it.

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const menu = new EmbedBuilder()
            .setColor(config.embed.renk)
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: config.embed.image })
            .setImage(config.embed.image)
            .setDescription("**```Yetkili Başvurusu İçin Aşağıdaki Butona Basınız.```**")

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yetkili-basvuru')
                    .setLabel('Staff Başvurusu Göndermek İçin Butona Tıkla!')
                    .setEmoji("📗")
                    .setStyle(ButtonStyle.Success),

            );
        interaction.channel.send({
            content: "||everyone|| **/** ||here||", embeds: [menu], components: [row]
        });
    },
};
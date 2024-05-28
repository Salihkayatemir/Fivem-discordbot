const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');
const config = require("../../../config.json");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    name: 'aktif',
    description: 'Server aktif mesajı gönderir.',
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,


    callback: async (client, interaction) => {
        if (!interaction.member.roles.cache.get(config.roller.yetkiliekip)) {
            interaction.reply(`> You must be <@&${config.roller.yetkiliekip}> to use this command ${interaction.member}.`)
        }

        const embed = new EmbedBuilder()
            .setColor(config.embed.renk)
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
            .setTitle("> Sunucu Aktif İyi Roller Dileriz.")
            .setDescription(`\`\`\`Server IP : ${config.sunucuIP}\`\`\``)
            .setImage(`${config.embed.image}`)
            .setFooter({ text: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
            .setTimestamp()

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Sunucuya Bağlan')
                    .setURL(config.sunuculink)
                    .setEmoji(config.emoji.tik)
                    .setStyle(ButtonStyle.Link),
            );
        interaction.channel.send({
            content: "**||everyone|| & ||here||**",
            embeds: [embed], components: [row]
        });
        interaction.reply("Successfully Sent Active Message!").then(msg => { setTimeout(() => msg.delete(), 2000) }).catch(console.error);
    }
};


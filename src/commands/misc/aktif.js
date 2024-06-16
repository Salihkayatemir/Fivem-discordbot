const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
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
    options: [
        {
            name: 'state',
            description: 'The user you want to ban.',
            type: ApplicationCommandOptionType.Boolean,
            required: true,
        },
    ],
    // deleted: true,
    // devOnly: Boolean,
    // testOnly: Boolean,

    callback: async (client, interaction) => {
        const state = interaction.options.get('state')?.value;

        if (!interaction.member.roles.cache.get(config.roles.yetkiliekip)) {
            interaction.reply(`> You must be <@&${config.roles.yetkiliekip}> to use this command ${interaction.member}.`)
            return;
        }

        if (state) {
            let channel = await interaction.guild.channels.fetch(config.channels.sunucuDurum)
            channel.setName("sunucu-aktif")
            const embed = new EmbedBuilder()
                .setColor(config.embed.renk)
                .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
                .setTitle("> Sunucu Aktif İyi roles Dileriz.")
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
                content: "**||@everyone|| & ||@here||**",
                embeds: [embed], components: [row]
            });
        } else if (!state) {
            let channel = await interaction.guild.channels.fetch(config.channels.sunucuDurum)
            channel.setName("sunucu-bakımda")
            const embed = new EmbedBuilder()
                .setColor(config.embed.renk)
                .setDescription(`Sunucumuz bir süreliğine bakımdadır. Anlayışınız için teşekkürler.`)
                .setTimestamp()
            interaction.channel.send({ embeds: [embed] });
        }


        interaction.reply({ content: "Successfully Sent Active Message!", ephemeral: true })
    }
};


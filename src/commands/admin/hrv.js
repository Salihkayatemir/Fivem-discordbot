const config = require("../../../config.json");
const {ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const db = require("quick.db");
module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();

        if (!interaction.member.roles.cache.get(config.roles.yetkiliekip)) {
            interaction.reply(`> You must be <@&${config.roles.yetkiliekip}> to use this command ${interaction.member}.`)
        }
        const rol = interaction.options.get('reason')?.value;
        if (!rol) return message.channel.send("❌ **Herkese Rol Verebilmem İçin Bir Rol Etiketlemelisin!**");

        const embed = new EmbedBuilder
            .setDescription(`✅ **Herkese ${rol} Adlı Rol Verildi!**`)
            .setColor(rol.hexColor);

        message.guild.members.forEach(u => {
            u.addRole(rol);
        });
        message.channel.send(embed);
    },
    name: 'hrv',
    description: 'Herkese Rol Verir', 
    devOnly: true, 
    options: [
        {
            name: 'rol',
            description: 'The reason',
            type: ApplicationCommandOptionType.Role,
        }
    ],

};
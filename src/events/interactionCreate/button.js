const { StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder, ChannelType, PermissionsBitField, AttachmentBuilder } = require("discord.js");
const RegisterModel = require('../../models/RegisterModel.js');
const config = require('../../../config.json');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
module.exports = async (client, interaction) => {

    if (!interaction.isButton()) return;
    try {
        if (interaction.customId === "kayıtbuton1") {

            if (!interaction.member.roles.cache.has(config.roller.whitelistrol)) //WH ROLÜ
            {
                client.channels.cache.get(config.kanal.whitelistbeklemelog).send(`${interaction.member} **Adlı Kişi Butona Bastı! Mülakatta Kayıt İçin Sizi Bekliyor. <@&${config.roller.yetkiliekip}> **`)  // Yetkibi Ekibi rolü
                interaction.reply({ content: `**Yetkililere bildirimin gönderildi!**\n Merhaba Hoşgeldin! ${interaction.member}\n Bu Sırada Mülakat Kanalına Geçiş Sağlayıp Bekleyebilirsin. \n **-->** <#${config.kanal.kayitbeklemeodasi}>`, ephemeral: true });
            } else {
                interaction.reply({ content: `Zaten kayıtlısın.`, ephemeral: true });
            }
        };
    } catch (error) {
        interaction.channel.send(`There was an error!\n\`\`\`${error}\`\`\``)
        console.log(`There was an error => ${error}`);
    }
    
};

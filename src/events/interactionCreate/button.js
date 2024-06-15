const config = require('../../../config.json');
module.exports = async (client, interaction) => {

    if (!interaction.isButton()) return;
    try {
        if (interaction.customId === "kayıtbuton1") {

            if (!interaction.member.roles.cache.has(config.roles.whitelistrol)) //WH ROLÜ
            {
                client.channels.cache.get(config.channels.whitelistbeklemelog).send(`${interaction.member} **Adlı Kişi Butona Bastı! Mülakatta Kayıt İçin Sizi Bekliyor. <@&${config.roles.yetkiliekip}> **`)  // Yetkibi Ekibi rolü
                interaction.reply({ content: `**Yetkililere bildirimin gönderildi!**\n Merhaba Hoşgeldin! ${interaction.member}\n Bu Sırada Mülakat channelsına Geçiş Sağlayıp Bekleyebilirsin. \n **-->** <#${config.channels.kayitbeklemeodasi}>`, ephemeral: true });
            } else {
                interaction.reply({ content: `Zaten kayıtlısın.`, ephemeral: true });
            }
        };
    } catch (error) {
        interaction.channel.send(`There was an error!\n\`\`\`${error}\`\`\``)
        console.log(`There was an error => ${error}`);
    }
};

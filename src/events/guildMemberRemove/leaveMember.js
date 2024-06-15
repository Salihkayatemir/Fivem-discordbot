const { EmbedBuilder } = require("discord.js");
const config = require('../../../config.json');
module.exports = async (client, member) => {
    const whitelistOutLog = client.channels.cache.get(config.channels.whitelistçıkışlog);

    if (member.roles.cache.has(config.roles.whitelistrol)) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(config.embed.renk)
            .setDescription(`${member} Adlı Whitelist üyemiz Sunucumuzdan Ayrıldı.\n Kullanıcının ID'si : **${member.id}**`)
            .setTimestamp();
        whitelistOutLog.send({content: `<@&${config.roles.authorizedTeam}>`, embeds: [exampleEmbed]});
    } else {
        client.channels.cache.get(config.channels.welcomeLog).send(`${member} sunucumuzdan ayrıldı.`);
    }
}
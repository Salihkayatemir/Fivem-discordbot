const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require('../../../config.json');
module.exports = async (channel) => {
    let kanal = config.channels.auditLog;
    if (!kanal) return;
    try {
        const entry = await channel.guild
            .fetchAuditLogs({ type: AuditLogEvent.ChannelDelete })
            .then(audit => audit.entries.first());
        if (entry.executor.id == client.user.id) return;
        if (entry.executor.hasPermission("ADMINISTRATOR")) return;
        channel.guild.createChannel(channel.name, "text", [
            {
                id: channel.guild.id
            }
        ]);

        const embed = new EmbedBuilder
            .setTitle(`Bir kanal silindi ve tekrar oluşturdum!`)
            .addField(`Silen`, entry.executor)
            .setColor("RED")
            .addField(`Silinen Kanal`, channel.name);
        kanal.send(embed).then(r => r.send('everyone'));
    } catch (error) {
        console.log('Hata: ', error);
    }

}
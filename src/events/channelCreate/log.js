const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require('../../../config.json');
module.exports = async (client, channel) => {
    let kanalId = config.channels.auditLog;
    if (!kanalId) return;

    try {
        const auditLogs = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate });
        const entry = auditLogs.entries.first();
        if (!entry || entry.executor.id === client.user.id) return;
        await channel.delete();
        const embed = new EmbedBuilder()
            .setTitle(`Bir kanal açıldı ve sildim!`)
            .setColor("RED")
            .addFields(
                { name: 'Kanal oluşturan', value: entry.executor.tag, inline: true },
                { name: 'Oluşturulan Kanal', value: channel.name, inline: true }
            )
            .setTimestamp();
        const auditLogChannel = channel.guild.channels.cache.get(kanalId);
        if (auditLogChannel) auditLogChannel.send({ embeds: [embed] });
        
    } catch (error) {
        console.error("Hata:", error);
    }
}
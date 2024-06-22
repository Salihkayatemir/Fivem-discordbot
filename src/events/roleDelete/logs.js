const { EmbedBuilder } = require("discord.js");
const config = require('../../../config.json');
module.exports = async role => {
    const entry = await role.guild;
    const log = config.channels.auditLog;
    if(!log) return;
    
    role.guild.members.get(entry.executor.id).roles.forEach(r => {
        role.guild.members.get(entry.executor.id).removeRole(r);
        log.send(new EmbedBuilder()
            .setTitle('Bir Rol Silindi!')
            .setColor(config.embed.renk)
            .addField(`Silen Kişi`, entry.executor)
            .addField(`Silinen Rol`, role.name)
            .addField(`Rol Permi`, role.permissions)
        )
    });
}
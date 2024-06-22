const config = require('../../../config.json');
module.exports = async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the reaction: ', error);
            return;
        }
    }

    if (reaction.message.channel.id === config.channels.icOnay && reaction.emoji.name === config.emoji.onay) {
        const member = reaction.message.guild.members.cache.get(user.id);

        if (member.roles.cache.has(config.roles.yetkiliekip)) {
            const targetMember = reaction.message.guild.members.cache.get(reaction.message.author.id);
            if (targetMember) {
                try {
                    await targetMember.setNickname(reaction.message.content);
                    await targetMember.roles.add(config.roles.onayperm);
                    console.log(`Assigned role and changed nickname for ${targetMember.user.tag}`);
                } catch (error) {
                    console.error('Error assigning role or changing nickname: ', error);
                }
            }
        }
    }
}
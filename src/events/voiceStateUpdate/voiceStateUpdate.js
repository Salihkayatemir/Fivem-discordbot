const config = require('../../../config.json');
module.exports = async (client, oldState, newState) => {
    const state = newState || oldState;
    const channels = client.channels.cache.get(config.channels.kayitbeklemeodasi);
  
    if (state.channelId !== channels) return;
    if (oldState.channel && !newState.channel) return;
    if (oldState.channel && oldState.selfMute && !newState.selfMute) return;
    if (oldState.channel && !oldState.selfMute && newState.selfMute) return;
    if (oldState.channel && oldState.selfDeaf && !newState.selfDeaf) return;
    if (oldState.channel && !oldState.selfDeaf && newState.selfDeaf) return;
    if (oldState.channel && !oldState.streaming && newState.channel && newState.streaming) return;
    if (oldState.channel && oldState.streaming && newState.channel && !newState.streaming) return;
    if (oldState.channel && !oldState.selfVideo && newState.channel && newState.selfVideo) return;
    if (oldState.channel && oldState.selfVideo && newState.channel && !newState.selfVideo) return;
  
    const embed = new EmbedBuilder().setDescription(`**${newState.member} Adlı Kişi ${channels} channelsına giriş yaptı!\nID:** ${newState.member.id}`).setColor(config.embed.renk);
    client.channels.cache.get(config.channels.whitelistbeklemelog).send({ embeds: [embed], content: `<@&${config.roles.authorizedTeam}> ` });
}
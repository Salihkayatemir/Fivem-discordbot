const { ActivityType, Status, Client } = require("discord.js")
const { joinVoiceChannel } = require('@discordjs/voice');
const config = require('../../../config.json');

module.exports = (client) => {
    client.user.setPresence({
        activities: [{ name: `Rolleri`, type: ActivityType.Listening }],
        status: Status.Idle,
        
    });
    
    
    let channel = client.channels.cache.get(`${config.kanal.botbağlanmases}`)
    if (!channel) return;
	const VoiceConnection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator
	});
};
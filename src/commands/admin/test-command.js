const config = require("../../../config.json");
module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();
    
        if (!interaction.member.roles.cache.get(config.roller.yetkiliekip)) {
            interaction.reply(`> You must be <@&${config.roller.yetkiliekip}> to use this command ${interaction.member}.`)
        }
        interaction.editReply('Hello! This project developed by **ragederler**. Enjoy it :)')
    },
    name: 'testing', // This is a mandatory option.
    description: 'Test Command', // This is a mandatory option.
    // deleted: true/false, // If this option is "true", even though the script exists, it will be considered deleted and will not run.
    // devOnly: true/false, // If this option is "true", only users in config.json>Admin can use it.
    // testOnly: true/false, // If this option is "true", this command will be valid only on the config.json>Guild_ID server.
};
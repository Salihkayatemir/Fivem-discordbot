const { Client, Interaction, ApplicationCommandOptionType, } = require('discord.js');
const config = require("../../../config.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        await interaction.deferReply();
        const targetUserId = interaction.options.get('target-user').value;
        const targetUser = await interaction.guild.members.fetch(targetUserId);
        if (!interaction.member.roles.cache.get(config.roller.yetkiliekip)) {
            interaction.reply(`> You must be <@&${config.roller.yetkiliekip}> to use this command ${interaction.member}.`)
        }

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }
        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't do this to that user because they are the server owner.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("I can't do this to this user because they have the same/higher role than you.");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't do this to this user because they have the same/higher role than me.");
            return;
        }
        // Command Execute Area
        try {
            let gethexid = await db.get(`hex.${targetUserId}`)
            await interaction.editReply(`${gethexid ? `I Found the ${targetUser}'s Hex id! => > ${gethexid}` : "Hex ID Not Found. Use **/hexekle** Command to Add!"}`);
        } catch (error) {
            interaction.editReply(`There was an error when find hex id!\n\`\`\`${error}\`\`\``)
            console.log(`There was an error when find hex id: ${error}`);
        }
    },

    name: 'hexbul',
    description: 'Returns the hex of the person you specify',
    options: [
        {
            name: 'target-user',
            description: 'The person whose hex id you want to find',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
    ],
};
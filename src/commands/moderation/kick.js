const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const config = require("../../../config.json");
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);
        if (!interaction.member.roles.cache.get(config.roles.yetkiliekip)) {
            interaction.reply(`> You must be <@&${config.roles.yetkiliekip}> to use this command ${interaction.member}.`)
        }

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't kick that user because they're the server owner.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't kick that user because they have the same/higher role than you.");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't kick that user because they have the same/higher role than me.");
            return;
        }
        const kicklog = new EmbedBuilder()
            .setTitle('Sunucudan Atıldı!')
            .setColor(config.embed.renk)
            .setDescription(`- Kişiyi Atan Yetkili: ${interaction.member}
- Yetkili ID: *${interaction.member.id}*
- Atılan Kişi: ${targetUser}
- Atılan Kişinin ID'si: *${targetUserId}*`)
            .setTimestamp();
        // kick the targetUser
        try {
            await targetUser.kick({ reason });
            await interaction.editReply(`User ${targetUser} was kicked\nReason: ${reason}`);
            await client.channels.cache.get(config.channels.banlog).send({ embeds: [kicklog] })
        } catch (error) {
            interaction.editReply(`There was an error when kicked:\n\`\`\`${error}\`\`\``)
            console.log(`There was an error when kicked: ${error}`);
        }
    },

    name: 'kick',
    description: 'Kick a member from this server!',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to kick.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason you want to kick.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    botPermissions: [PermissionFlagsBits.KickMembers],
};
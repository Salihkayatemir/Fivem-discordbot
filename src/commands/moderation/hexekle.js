const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, } = require('discord.js');
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
        const steamhex = interaction.options.get('hexid')?.value;
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
        const hexlog = new EmbedBuilder()
            .setTitle('Hex ID Eklendi!')
            .setColor(config.embed.renk)
            .setDescription(`- Ekleyen Yetkili: ${interaction.member}\n- Yetkili ID: ${interaction.member.id}\n- Kişi: ${targetUser}\n- Kişinin ID'si: *${targetUserId}*\n- Hex ID: **${steamhex}**`)
            .setTimestamp();

        // Command Execute Area
        try {
            await db.set(`hex.${targetUserId}`, steamhex);
            interaction.editReply(`I added ${targetUser}'s hex id => ${steamhex}`);
            await client.channels.cache.get(config.kanal.hexroom).send({ embeds: [hexlog] });
        } catch (error) {
            interaction.editReply(`There was an error when giving hex id!\n\`\`\`${error}\`\`\``)
            console.log(`There was an error when giving hex id: ${error}`);
        }
    },

    name: 'hexekle',
    description: 'Returns the hex of the person you specify!',
    options: [
        {
            name: 'target-user',
            description: 'Tag the person you will add Hex ID to.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'hexid',
            description: "enter the person's hex id",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

};
const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const RegisterModel = require('../../models/RegisterModel');
const config = require("../../../config.json");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {
        await interaction.deferReply();
        // Command Execute Area
        try {
            const targetUserId = interaction.options.get('target-user').value;
            const hexID = interaction.options.get('hexid')?.value;
            const steam = interaction.options.get('steam-account')?.value;
            const targetUser = await interaction.guild.members.fetch(targetUserId);

            if (!interaction.member.roles.cache.get(config.roles.yetkiliekip)) {
                interaction.reply(`> You must be <@&${config.roles.yetkiliekip}> to use this command ${interaction.member}.`)
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


            let registrar = interaction.member.id
            const registrationScore = 1;
            let registering = await RegisterModel.findOne({ registrar });
            if (!registering) {
                registering = new RegisterModel({ registrar, registercount: 1 });
            } else {
                registering.registercount += registrationScore;
            }
            await registering.save();

            // Setting role, data and name
            await db.set(`hex.${targetUserId}`, hexID);
            await targetUser.setNickname("IC ISIM")
            await targetUser.roles.add(config.roles.whitelistrol)
            await targetUser.roles.remove(config.roles.nonwhitelistrol)

            // sending logs
            const kayitlog = new EmbedBuilder()
                .setTitle('Yeni Kayıt!')
                .setColor(config.embed.renk)
                .setDescription(`- Kayıt Eden Yetkili: ${interaction.member}\n- Yetkili ID: ${interaction.member.id}\n- Kayıt Edilen Kişi: ${targetUser}\n- Kişinin ID'si: *${targetUserId}*\n- Hex ID: **${hexID}**\n- Steam Hesabı: ${steam}\n\n **__Kayıt Ettiği Üye Sayısı:__** ${registering.registercount}`)
                .setTimestamp();

            const hexlog = new EmbedBuilder()
                .setTitle('Yeni Kayıt İle Birlikte Hex ID Eklendi!')
                .setColor(config.embed.renk)
                .setDescription(`- Kayıt Eden/Ekleyen Yetkili: ${interaction.member}\n- Yetkili ID: ${interaction.member.id}\n- Kişi: ${targetUser}\n- Kişinin ID'si: *${targetUserId}*\n- Hex ID: **${hexID}**`)
                .setTimestamp();


            interaction.editReply(`**I have successfully registered the contact!**\n> ${targetUser}'s\n> Hex ID: ${hexID}\n> Steam Account: ${steam}`);
            client.channels.cache.get(config.channels.kayitlog).send({ embeds: [kayitlog] })
            client.channels.cache.get(config.channels.hexroom).send({ embeds: [hexlog] })
        } catch (error) {
            interaction.channel.send(`There was an error when giving hex id!\n\`\`\`${error}\`\`\``)
            console.log(`There was an error when giving hex id: ${error}`);
        }
    },

    name: 'kaydet',
    description: 'Returns the hex of the person you specify!',
    options: [
        {
            name: 'target-user',
            description: "The person you will register with",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'hexid',
            description: "enter the person's hex id",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'steam-account',
            description: "enter the person's steam account",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

};
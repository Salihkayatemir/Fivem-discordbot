const { StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder, ChannelType, PermissionsBitField, AttachmentBuilder} = require("discord.js");
const RegisterModel = require('../../models/RegisterModel.js');
const config = require('../../../config.json');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
module.exports = async (client, interaction) => {

    if (!interaction.isStringSelectMenu())return;
    
    if (interaction.customId === "kayitpuan") {

        if (interaction.values[0] == "sıfırlaa2") {
            interaction.update({})
            return
        }
        const guild = interaction.guild;
        const userKayits = {};
        const usersWithModeratorRole = guild.members.cache.filter(member => member.roles.cache.has(config.roles.yetkiliekip)).map(member => member.user.id);

        RegisterModel.find({ registrar: { $in: usersWithModeratorRole } }).then(registercount => {
            registercount.forEach(i => {
                if (!userKayits[i.registrar]) {
                    userKayits[i.registrar] = i.registercount;
                } else {
                    userKayits[i.registrar] += i.registercount;
                }
            });

            const sortedUserKayits = Object.entries(userKayits)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 15);

            if (sortedUserKayits.length === 0) {
                return interaction.reply({ content: '**Kimsenin Kayıt Puanı Yok Listeliyemem.**', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(config.embed.renk)
                .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
                .setTitle('Kayıt Puan Sıralaması')
                .setImage(`${config.embed.image}`)
                .setDescription(
                    sortedUserKayits
                        .map(([registrar, registercount], index) => `> **${index + 1}. <@${registrar}> =>** __${registercount} Kayıt!__`)
                        .join('\n\n')
                )
                .setTimestamp();
            interaction.update({ embeds: [embed], components: [], ephemeral: true });
        })
    }
    try {
        // Ticket Area
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('del')
                    .setPlaceholder(`Ticket'ı Kapatmak İçin Tıkla!`)
                    .addOptions([

                        {
                            label: `Kaydet & Ticket'ı Kapat!`,
                            description: `Ticket'ı Kaydeder ve Kapatır.`,
                            value: 'delete',
                            emoji: "💾"
                        },
                        {
                            label: `Sorunu çözebildim, yardıma gerek kalmadı.`,
                            description: `Sorununuzu çözdüyseniz bunu seçin.`,
                            value: 'delete2',
                            emoji: '⚙️'
                        }

                    ])
            );

        var serverIcon = interaction.guild.iconURL({ dynamic: true });

        let DejaUnChannel = await interaction.guild.channels.cache.find(c => c.topic == interaction.user.id)


        if (interaction.customId === "del") {

            if (interaction.values[0] == "delete2") {
                if (interaction.member.roles.cache.has(config.roles.yetkiliekip)) return interaction.reply({ content: `You are an Staff, this option is available for the ticket holder `, ephemeral: true })


                interaction.channel.permissionOverwrites.edit(interaction.member, {
                    SendMessages: false,
                    ViewChannel: false,
                });

                const kendiçözdü = new EmbedBuilder()
                    .setDescription(`**${interaction.member} Sorununu Kendi Çözdüğünü Söyledi.** \n\n __${interaction.user.tag}'a channelsı Görmeyi ve Yazmayı Kapattım!__`)
                    .setAuthor({ name: `${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}` })
                    .setThumbnail(`${interaction.member.displayAvatarURL()}`)
                    .setTimestamp()
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
                await interaction.reply({ embeds: [kendiçözdü], content: `<@&${config.roles.yetkiliekip}>` })
            }



            if (interaction.values[0] == "delete") {
                const yetkinyok = new EmbedBuilder().setColor(config.embed.renk).setDescription(`Bu işlemi sadece <@&${config.roles.yetkiliekip}> Kapatabilir.**`);
                if (!interaction.member.roles.cache.has(config.roles.yetkiliekip)) return interaction.reply({ embeds: [yetkinyok], ephemeral: true });

                const channel = interaction.channel;
                interaction.channel.messages.fetch().then(async (messages) => {
                    const Coin = require('../../models/coin.js');

                    let userID = interaction.member.id
                    const puan = 1;

                    let coin = await Coin.findOne({ userID });

                    if (!coin) {
                        coin = new Coin({ userID, coins: puan });
                    } else {
                        coin.coins += puan;
                    }

                    await coin.save();
                    try {
                        const output = messages.map(m => `${new Date(m.createdAt).toLocaleString('tr-TR')} - **${m.author.tag}:** *${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}*`).join('\n');
                        const embed = new EmbedBuilder()
                            .setAuthor({ name: `Ticket Adı: ${interaction.channel.name}`, iconURL: `${config.embed.image}` })
                            .setTitle('Ticket Kapatıldı!')
                            .setDescription(`> **Ticket Mesajları Aşağıdadır;**\n\n ${output} \n\n **Ticket'ı Kapatan Yetkili ${interaction.user}** \n\n **${interaction.user} Adlı Yetkilinin Ticket Puanı:** __${coin.coins}__`)
                            .setThumbnail(`${interaction.user.displayAvatarURL()}`)
                            .setTimestamp()
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
                        await client.channels.cache.get(config.channels.ticketlogu).send(
                            { embeds: [embed], content: `**----------------------------------------------------------**` }
                        )

                        channel.delete()

                    } catch (err) {

                        const output = messages.map(m => `${new Date(m.createdAt).toLocaleString('tr-TR')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

                        const atc = new AttachmentBuilder(Buffer.from(output), { name: 'rageTicketLog.txt' })

                        const embed = new EmbedBuilder()
                            .setAuthor({ name: `Ticket Adı: ${interaction.channel.name}`, iconURL: `${config.embed.image}` })
                            .setTitle('Ticket Kapatıldı!')
                            .setDescription(`> **Ticket Mesajları Aşağıdadır;**\n\n *Mesajlar uzun olduğu için txt formatı ile kayıt ettim.* \n\n **Ticket'ı Kapatan Yetkili ${interaction.user}** \n\n **${interaction.user} Adlı Yetkilinin Ticket Puanı:** __${coin.coins}__`)
                            .setThumbnail(`${interaction.user.displayAvatarURL()}`)
                            .setTimestamp()
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })


                        client.channels.cache.get(config.channels.ticketlogu).send({ files: [atc], content: `**----------------------------------------------------------**`, embeds: [embed] })
                        channel.delete()
                    }
                });
            }
        }

        // Ticket Categories Area
        if (interaction.values[0] == "Sıfırla") {
            interaction.update({})
            return
        }
        if (interaction.customId == "selectTicket") {
            if (DejaUnChannel) return interaction.reply({ content: `**Zaten Bir Ticket Talebin Açık.** ${config.emoji.no}`, ephemeral: true })

            if (interaction.values[0] == "other") {
                await interaction.guild.channels.create({
                    type: ChannelType.GuildText,
                    name: `ticket-${interaction.user.username}`,
                    topic: `${interaction.user.id}`,
                    parent: config.channels.ticketkategori,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        },
                        {
                            id: config.roles.yetkiliekip,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        }
                    ]
                }).then((c) => {
                    const partenariat = new EmbedBuilder()
                        .setColor(config.embed.renk)
                        .setTitle(`${config.emoji.diğerkategorileremoji} *Diğer kategoriler hakkında* bilet Açtı!`)
                        .setDescription('Lütfen yaşadığınız sorunu anlatır mısınız?, Resim, video atabilirsiniz.')
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
                    c.send({ embeds: [partenariat], content: `<@&${config.roles.yetkiliekip}> | ${interaction.user}`, components: [row] })
                    interaction.reply({ content: `${config.emoji.onay} **Bilet Oluşturma Talebin Başarıyla Alındı! channels:** <#${c.id}>`, ephemeral: true })
                })
            } else if (interaction.values[0] == "general") {
                await interaction.guild.channels.create({
                    type: ChannelType.GuildText,
                    name: `ticket-${interaction.user.username}`,
                    topic: `${interaction.user.id}`,
                    parent: `${config.channels.ticketkategori}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        },
                        {
                            id: config.roles.yetkiliekip,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        }
                    ]
                }).then((c) => {
                    const plainte = new EmbedBuilder()
                        .setTitle(`${config.emoji.destekemojisi} *Destek, bug ve teknik sorunlar* hakkında bilet açtı!`)
                        .setDescription('Lütfen yaşadığınız sorunu anlatır mısınız?, Resim, video atabilirsiniz.')
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
                    c.send({ embeds: [plainte], content: `<@&${config.roles.yetkiliekip}> | ${interaction.user}`, components: [row] })
                    interaction.reply({ content: `${config.emoji.onay} **Bilet Oluşturma Talebin Başarıyla Alındı! channels:** <#${c.id}>`, ephemeral: true })
                })
            } else if (interaction.values[0] == "shopping") {
                await interaction.guild.channels.create({
                    type: ChannelType.GuildText,
                    name: `ticket-${interaction.user.username}`,
                    topic: `${interaction.user.id}`,
                    parent: `${config.channels.ticketkategori}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        },
                        {
                            id: config.roles.yetkiliekip,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        }
                    ]
                }).then((c) => {
                    const embed = new EmbedBuilder()
                        .setTitle(`${config.emoji.donatemoji} *Donate alımlar ve ödemeler* hakkında bilet açtı!`)
                        .setDescription('Yetkililer Yazmadan Önce, Detaylı Bilgi Vererek Anlatabilirsin Veya Bekleyebilirsin.')
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
                    c.send({ embeds: [embed], content: `<@&${config.roles.yetkiliekip}> | ${interaction.user}`, components: [row] })
                    interaction.reply({ content: `${config.emoji.onay} **Bilet Oluşturma Talebin Başarıyla Alındı! channels:** <#${c.id}>`, ephemeral: true })
                })
            }
            else if (interaction.values[0] == "staff") {
                await interaction.guild.channels.create({
                    type: ChannelType.GuildText,
                    name: `ticket-${interaction.user.username}`,
                    topic: `${interaction.user.id}`,
                    parent: `${config.channels.ticketkategori}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        },
                        {
                            id: config.roles.yetkiliekip,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles]
                        }
                    ]
                }).then((c) => {
                    const plainte = new EmbedBuilder()
                        .setTitle(`${config.emoji.oyuniçisorunemoji
                            }  *Oyun içi sorunlar ve rol hataları* Hakkında Ticket Açtı!`)
                        .setDescription('Oyun içi Sorunlar & Rol Hataları Olarak Ne Yaşadınız ?')
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
                    c.send({ embeds: [plainte], content: `<@&${config.roles.yetkiliekip}> | ${interaction.user}`, components: [row] })
                    interaction.reply({ content: `${config.emoji.onay} **Bilet Oluşturma Talebin Başarıyla Alındı! channels:** <#${c.id}>`, ephemeral: true })
                })
            }
        }
    } catch (error) {
        interaction.channel.send(`There was an error!\n\`\`\`${error}\`\`\``)
        console.log(`There was an error => ${error}`);
    }
};

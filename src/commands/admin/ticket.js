const { StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");

const config = require("../../../config.json");
module.exports = {

    callback: async (client, interaction) => {
        await interaction.deferReply();
        if (!interaction.member.roles.cache.get(config.roller.yetkiliekip)) {
            interaction.editReply(`> You must be <@&${config.roller.yetkiliekip}> to use this command ${interaction.member}.`)
            return;
        }

        const row = new ActionRowBuilder()
            .addComponents(new StringSelectMenuBuilder()
                .setCustomId('selectTicket')
                .setPlaceholder('Lütfen Kategori Seçiniz.')
                .addOptions([
                    {
                        label: 'Destek, Bug & Teknik Sorunlar',
                        description: 'Destek, Bug veya Teknik Sorun Almak İstiyorsanız.',
                        value: 'general',
                        emoji: `${config.emoji.destekemojisi}`
                    },
                    {
                        label: 'Oyun içi Sorunlar & Rol Hataları',
                        description: 'Oyun içi Sorunlar & Rol Hataları',
                        value: 'staff',
                        emoji: `${config.emoji.oyuniçisorunemoji}`
                    },
                    {
                        label: 'Donate İşlemleri',
                        description: 'Satın almak istediğiniz araç/işletmeler için.',
                        value: 'shopping',
                        emoji: `${config.emoji.donatemoji}`
                    },
                    {
                        label: 'Diğer Kategoriler',
                        description: 'Sebebiniz Eğer Burada Yoksa, Bu Kategoride Ticket Açın.',
                        value: 'other',
                        emoji: `${config.emoji.diğerkategorileremoji}`
                    },
                    {
                        label: 'Seçenek Sıfırla',
                        description: 'Seçenekleri Sıfırlamanıza Yarar.',
                        value: 'Sıfırla',
                        emoji: `${config.emoji.kategorisifirlaemoji}`
                    },

                ]),
            );
        const ticket = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${config.embed.image}` })
            .setDescription('Ticket açmak için konunuzu içeren kategoriyi seçiniz. \n\n *__Biletleri gereksiz yere kullananlara ceza-i işlem uygulanacaktır.__*')
            .setThumbnail(`${config.embed.image}`)
        interaction.editReply(`Successfully Sent Ticket Embed ${config.emoji.onay}`).then(msg => {setTimeout(() => msg.delete(), 2000)}).catch(console.error);
        interaction.channel.send({embeds: [ticket], components: [row]})
    },
    name: 'ticketsetup',
    description: 'Setup the ticket.',
    devOnly: true, // config.json -> Admin ID
};
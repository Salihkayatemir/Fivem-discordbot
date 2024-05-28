const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../../config.json");
module.exports = {
    name: 'mülakatembed',
    description: 'Returns the hex of the person you specify!',
    devOnly: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();
        const kayıtbutonu1 = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setCustomId("kayıtbuton1")
                .setLabel('Mülakat Bekliyorum')
                .setStyle(ButtonStyle.Primary)
            )
            .addComponents(new ButtonBuilder()
                .setLabel('Sunucu Kitapçığı')
                .setURL(config.sunucukitapcigi)
                .setEmoji(config.emoji.tik)
                .setStyle(ButtonStyle.Link),
            );

        let embed = new EmbedBuilder()
            .setColor(config.embed.renk)
            .setTitle('Sesli Mülakatta Bekliyorsan Butona Tıkla.')
            .setDescription(`- Sunucumuza Hoşgeldiniz. ForceV Ekibi olarak sizi aramızda görmeyi çok isteriz.
- Siz değerli oyuncularımız için kaliteli ve güzel bir sunucu ortamı kurmaktayız. Bu nedenle sunucumuzda karakter-hikayesi ve karakter-gelişim kuralları uygulanmaktadır.
- Sunucumuz Sosyal Hard RP temalıdır.       
- Daha kaliteli roller için aile, baron vb. kuruluşları sunucumuzda desteklemiyoruz. Custom çete - oluşumunuz var ise yetkililere bildirerek ayrıcalıklardan faydalanabilirsiniz.
- Mülakatları geçmek için +18 yaşında olmanız(17 yaşındaysanız ve sesiniz uygunsa insiyatif uygulanabilir) ve genel rol terimlerini bilmeniz gerekmektedir.   
- Oluşan sorunlarda sizlere en hızlı şekilde geri dönüş sağlamaktayız. `)
            .setThumbnail(config.embed.image)

        interaction.channel.send({ embeds: [embed], components: [kayıtbutonu1] });
        interaction.editReply({ content: 'Başarıyla mesajı gönderdim' });
    },
};
const { EmbedBuilder } = require("discord.js");
const config = require('../../../config.json');
const moment = require("moment");
module.exports = async (client, member) => {
    const logChannel = client.channels.cache.get(`${config.channels.welcomeLog}`);

    if (member.user.bot) return logChannel.send(`**Sunucuya bir bot katıldı!** \n> Katılan BOT => ${member} @everyone`);
    if (!member.roles.cache.has(config.roles.nonwhitelistrol)) return await member.roles.add(config.roles.nonwhitelistrol);

    let date = moment(member.user.createdAt);
    const startedAt = Date.parse(date);
    var msecs = Math.abs(new Date() - startedAt);
    const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
    msecs -= years * 1000 * 60 * 60 * 24 * 365;
    const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
    msecs -= months * 1000 * 60 * 60 * 24 * 30;
    const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
    msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
    const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
    msecs -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(msecs / (1000 * 60 * 60));
    msecs -= hours * 1000 * 60 * 60;
    const mins = Math.floor(msecs / (1000 * 60));
    msecs -= mins * 1000 * 60;
    const secs = Math.floor(msecs / 1000);
    msecs -= secs * 1000;

    var string = "";
    if (years > 0) string += `${years} yıl ${months} ay`;
    else if (months > 0)
        string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`;
    else if (weeks > 0)
        string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`;
    else if (days > 0)
        string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`;
    else if (hours > 0)
        string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`;
    else if (mins > 0)
        string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`;
    else if (secs > 0) string += `${secs} saniye`;

    string = string.trim();

    let endAt = member.user.createdAt;
    let gün = moment(new Date(endAt).toISOString()).format("DD");
    let ay = moment(new Date(endAt).toISOString())
        .format("MM")
        .replace("01", "Ocak")
        .replace("02", "Şubat")
        .replace("03", "Mart")
        .replace("04", "Nisan")
        .replace("05", "Mayıs")
        .replace("06", "Haziran")
        .replace("07", "Temmuz")
        .replace("08", "Ağustos")
        .replace("09", "Eylül")
        .replace("10", "Ekim")
        .replace("11", "Kasım")
        .replace("12", "Aralık");
    let yıl = moment(new Date(endAt).toISOString()).format("YYYY");
    let saat = moment(new Date(endAt).toISOString()).format("HH:mm");
    let kuruluş = `${gün} ${ay} ${yıl} ${saat}`;

    const exampleEmbed = new EmbedBuilder()
        .setColor(config.embed.renk)
        .setTitle("Sunucumuza Hoşgeldin!")
        .setImage(config.embed.image)
        .setDescription(`- **Kuruluş Tarihi:** \`${kuruluş} (${string})\` önce oluşturulmuş.\n- **Mülakata Girmeye Hazır Olduğunda <#${config.channels.kayitbeklemeodasi}> channels'ına Giriş Yaparsan, <@&${config.roles.yetkiliekip}> Sizinle İlgilenecektir.**\n- **Kişinin ID'si =** ${member.id}`)
        .setTimestamp();

    logChannel.send({ content: `${member}`, embeds: [exampleEmbed] });
}
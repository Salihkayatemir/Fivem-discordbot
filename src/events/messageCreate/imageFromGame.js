const config = require('../../../config.json');
module.exports = async (client, message) => {
    if (message.channel.id !== `${config.channels.imageFromGame}`) return;
    if (message.author === client.user) return;
    if (message.content.includes("https://media.discordapp.net/attachments/")) return;
    if (message.attachments.size < 1) {
        message.delete();
        message.channel.send( `**${message.author} Bu Kanalda Resim Dışında Başka Bir Şey Atılmıyor!**`).then((msg) => {
            setTimeout(() => msg.delete(), 5000);
        }).catch(console.error);
    } else {
        message.react('<a:bkalp:1223292334578470972>')
    }
}
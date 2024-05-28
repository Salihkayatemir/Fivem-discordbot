require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AuditLogEvent,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const config = require("../config.json");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGOOSE);
const moment = require("moment");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildIntegrations,
    IntentsBitField.Flags.GuildWebhooks,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessageTyping,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildScheduledEvents,
    IntentsBitField.Flags.AutoModerationConfiguration,
    IntentsBitField.Flags.AutoModerationExecution,
  ],
});

eventHandler(client);

client.on("guildMemberRemove", async (member) => {
  if (member.roles.cache.has(config.roller.whitelistrol)) {
    const log5 = client.channels.cache.get(config.kanal.whitelistçıkışlog);
    const exampleEmbed = new EmbedBuilder()
      .setColor(config.embed.renk)
      .setDescription(
        `${member} Adlı Whitelist üyemiz Sunucumuzdan Ayrıldı.\n Kullanıcının ID'si : **${member.id}**`
      )
      .setTimestamp();
    log5.send({
      content: `<@&${config.roller.logYetkiliEkip}>`,
      embeds: [exampleEmbed],
    });
    return;
  } else {
    client.channels.cache
      .get(config.kanal.hoşgeldinizlog)
      .send(`${member} sunucumuzdan ayrıldı.`);
    return;
  }
});

client.on("guildMemberAdd", async (member) => {
  if (member.user.bot) return;
  if (!member.roles.cache.has(config.roller.nonwhitelistrol)) {
    await member.roles.add(config.roller.nonwhitelistrol);
  }

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

  const log3 = client.channels.cache.get(`${config.kanal.hoşgeldinizlog}`);
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
    .setDescription(
      `- **Kuruluş Tarihi:** \`${kuruluş} (${string})\` önce oluşturulmuş.\n- **Mülakata Girmeye Hazır Olduğunda <#${config.kanal.kayitbeklemeodasi}> Kanal'ına Giriş Yaparsan, <@&${config.roller.yetkiliekip}> Sizinle İlgilenecektir.**\n- **Kişinin ID'si =** ${member.id}`
    )
    .setTimestamp();

  log3.send({ content: `${member}`, embeds: [exampleEmbed] });
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const state = newState || oldState;

  if (state.channelId !== `${config.kanal.kayitbeklemeodasi}`) {
    return;
  }

  const kanal = client.channels.cache.get(config.kanal.kayitbeklemeodasi);

  if (oldState.channel && !newState.channel) return;

  if (oldState.channel && oldState.selfMute && !newState.selfMute) return;
  if (oldState.channel && !oldState.selfMute && newState.selfMute) return;
  if (oldState.channel && oldState.selfDeaf && !newState.selfDeaf) return;
  if (oldState.channel && !oldState.selfDeaf && newState.selfDeaf) return;
  if (
    oldState.channel &&
    !oldState.streaming &&
    newState.channel &&
    newState.streaming
  )
    return;
  if (
    oldState.channel &&
    oldState.streaming &&
    newState.channel &&
    !newState.streaming
  )
    return;
  if (
    oldState.channel &&
    !oldState.selfVideo &&
    newState.channel &&
    newState.selfVideo
  )
    return;
  if (
    oldState.channel &&
    oldState.selfVideo &&
    newState.channel &&
    !newState.selfVideo
  )
    return;

  const embed = new EmbedBuilder()
    .setDescription(
      `**${newState.member} Adlı Kişi ${kanal} kanalına giriş yaptı!\nID:** ${newState.member.id}`
    )
    .setColor(config.embed.renk);
  client.channels.cache
    .get(config.kanal.whitelistbeklemelog)
    .send({ embeds: [embed], content: `<@&${config.roller.logYetkiliEkip}> ` });
});

client.on("messageCreate", async (message) => {
  if (message.channel.id !== `${config.kanal.oyundankareler}`) return;
  if (message.author === client.user) return;
  if (message.content.includes("https://media.discordapp.net/attachments/"))
    return;
  if (message.attachments.size < 1) {
    message.delete();
    message.react(config.emoji.kopke);
    message.channel
      .send(
        `**${message.author} Bu Kanalda Resim Dışında Başka Bir Şey Atılmıyor!**`
      )
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      })
      .catch(console.error);
  }
});
client.login(process.env.TOKEN);
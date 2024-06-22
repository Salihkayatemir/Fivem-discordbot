require("dotenv").config();
const { Client, IntentsBitField, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, GatewayIntentBits, Partials } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const config = require("../config.json");
const { QuickDB } = require("quick.db");
const db2 = new QuickDB();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGOOSE);

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
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
});
eventHandler(client);

const { Modal, TextInputComponent, showModal } = require('discord-modals')
const discordModals = require('discord-modals')
discordModals(client);

client.on('interactionCreate', async (interaction) => {

  if (interaction.customId === "yetkili-basvuru") {
    showModal(nrcmodal, {
      client: client,
      interaction: interaction
    })
  }

  if (interaction.customId === "yetkili-basvuru-onay") {
    let sahip = db2.fetch(`onay-red-mesaj_${interaction.message.id}`)
    let botid = db2.fetch(`bot_id_${sahip}`)

    const embed = new EmbedBuilder()
      .setColor(config.embed.renk)
      .setDescription(`**${botid}** Başvuru Onaylandı.**Onaylayan Yetkili:** <@${interaction.user.id}> (${interaction.user.id})`)
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder()
      .setCustomId('onaylandı')
      .setLabel('Başvuru Onaylandı.')
      .setStyle(ButtonStyle.Success)
      .setDisabled(true)

    );
    await interaction.update({ embeds: [embed], components: [row] });
    db2.delete(`onay-red-mesaj_${interaction.message.id}`)
    db2.delete(`bot_bilgi_${botid}`)
    db2.delete(`bot_${botid}`)
    db2.delete(`bot_id_${sahip}`)
  }
});

const nrcmodal = new Modal()
  .setCustomId('rage-yetkilisistem')
  .setTitle(`ForceV Başvuru Formu`)
  .addComponents(
    new TextInputComponent()
      .setCustomId('bot-id')
      .setLabel('Neden yetkili olmak istiyorsunuz?')
      .setStyle('LONG')
      .setMinLength(1)
      .setMaxLength(100)
      .setPlaceholder('Nedenlerinizi belirtiniz.')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('bot-yas')
      .setLabel('Yaşınız?')
      .setStyle('LONG')
      .setMinLength(1)
      .setMaxLength(50)
      .setPlaceholder('Yaşınızı belirtiniz.')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('bot-prefix')
      .setLabel('Daha önce tecrübeniz varmı?')
      .setStyle('LONG')
      .setMinLength(1)
      .setMaxLength(100)
      .setPlaceholder('Var ise nelerdir belirtiniz.')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('bot-destek')
      .setLabel('Destek kanalında iki grup arasında tartışma var, ne yaparsınız?')
      .setStyle('LONG')
      .setMaxLength(100)
      .setMinLength(1)
      .setPlaceholder('Ne yapmanız gerektiğini yazınız.')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('bot-hakkinda')
      .setLabel('Eklemek-sormak isteyecekleriniz.')
      .setMaxLength(100)
      .setStyle('LONG')
      .setPlaceholder('Onaylandığınız taktirde sorularınız cevaplanacaktır.')
  );

client.on('modalSubmit', async (modal) => {
  if (modal.customId === 'rage-yetkilisistem') {
    const botid = modal.getTextInputValue('bot-id')
    const botprefix = modal.getTextInputValue('bot-prefix')
    const topgg = modal.getTextInputValue('bot-onay')
    const aciklama = modal.getTextInputValue('bot-hakkinda')
    const botdestek = modal.getTextInputValue('bot-destek')
    const botyas = modal.getTextInputValue('bot-yas')

    // let kontrol = db2.fetch(`bot_id_${modal.user.id}`)
    await modal.deferReply({ ephemeral: true })
    // if (kontrol) return modal.followUp({ content: `Zaten Başvuru Yapmışsın Onaylanmasını Bekleyiniz.`, ephemeral: true })
    db2.set(`bot_id_${modal.user.id}`, botid)
    db2.set(`bot_${botid}`, modal.user.id)
    db2.set(`bot_bilgi_${botid}`, [])
    db2.push(`bot_bilgi_${botid}`, botprefix)
    db2.push(`bot_bilgi_${botid}`, topgg)
    db2.push(`bot_bilgi_${botid}`, botdestek)
    db2.push(`bot_bilgi_${botid}`, botyas)

    db2.push(`bot_bilgi_${botid}`, aciklama ? aciklama : "açıklama bulunamadı")
    modal.followUp({ content: `**Başarılı Bir Şekilde Staff Başvurun Gönderildi.**`, ephemeral: true })

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('yetkili-basvuru-onay')
          .setLabel('Başvuruyu Onayla!')
          .setStyle(ButtonStyle.Success),
      );

    const embed = new EmbedBuilder()
      .setColor(config.embed.renk)
      .setDescription(`
			> **Staff Başvurusu Bilgileri;**\n
			**Neden Staff Olmak İstiyorsunuz? :** \`\`\`\ ${botid}\`\`\`\
			**Daha Önce Yetkilik Yaptınız Mı? (Yetkilide Hedefleriniz Neler?) :** \`\`\`\ ${botprefix}\`\`\`\
			**Yaşınız ?:** \`\`\`\ ${botyas} \`\`\`\
			**Destek Kanalında Tartışma Var Ne Yapardınız ?:** \`\`\`\ ${botdestek}\`\`\`\
			**Ek Açıklama;**
			\`\`\`\ ${aciklama ? aciklama : "Açıklama Bulunamadı."} \`\`\`\
	
			> **Başvuru Gönderen Kullanıcı Bilgileri;**
	
			**İD:** \`${modal.user.id} ${modal.user.username}\`
			**Etiket:** <@${modal.user.id}>
			`)
      .setImage(config.embed.image)


    try {
      const embed5 = new EmbedBuilder()
        .setColor(config.embed.renk)
        .setAuthor({ name: `ForceV Roleplay`, iconURL: config.embed.image })
        .setDescription(`Başvuru formunu yetkililere ilettim, bize katılmak istediğin için teşekkürler. Onaylandığında sana buradan dönüş yapacağım.`)
      modal.user.send({ embeds: [embed5] })

      modal.guild.members.cache.filter(member => member.roles.cache.has('1223242008035065887')).forEach(member => {
        member.send({ embeds: [embed], components: [row] }).then(c => {

        })
      });
    } catch (error) {
      console.log('Başvuru formunda bir hata var:', error)
    }
  }
})


client.login(process.env.TOKEN);
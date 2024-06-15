const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Coin = require('../../models/coin');
const config = require("../../../config.json");
module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  name: 'top',
  description: 'Returns the hex of the person you specify',

  callback: async (client, interaction) => {
    await interaction.deferReply();
    if (!interaction.member.roles.cache.get(config.roles.yetkiliekip)) {
      interaction.reply(`> You must be <@&${config.roles.yetkiliekip}> to use this command ${interaction.member}.`)
    }

    // Command Execute Area
    try {
      const guild = interaction.guild;
      const userCoins = {};
      const usersWithModeratorRole = guild.members.cache.filter(member => member.roles.cache.has(config.roles.yetkiliekip)).map(member => member.user.id);

      Coin.find({ userID: { $in: usersWithModeratorRole } }).then(coins => {
        coins.forEach(coin => {
          if (!userCoins[coin.userID]) {
            userCoins[coin.userID] = coin.coins;
          } else {
            userCoins[coin.userID] += coin.coins;
          }
        });

        const sortedUserCoins = Object.entries(userCoins)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 15);

        if (sortedUserCoins.length === 0) {
          return interaction.editReply({ content: 'No one have ticket score', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setColor(config.embed.renk)
          .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
          .setTitle('Ticket Puan Sıralaması')
          .setImage(`${config.embed.image}`)
          .setDescription(
            sortedUserCoins
              .map(([userID, coins], index) => `> **${index + 1}. <@${userID}> =>** __${coins} Puan__`)
              .join('\n\n')
          )
          .setTimestamp();


        const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('kayitpuan')
              .setPlaceholder(`Stat Kategorisini Seçiniz.`)
              .addOptions([
                {
                  label: 'Kayıt Puanı',
                  description: 'Kayıt Puanın Sıralamasını Gösterir.',
                  value: 'kayitpuan',
                },
                {
                  label: 'Seçenek Sıfırla',
                  description: 'Seçenekleri Sıfırlamanıza Yarar.',
                  value: 'sıfırlaa2',
                },
              ]),
          )

        interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });
      })
    } catch (error) {
      interaction.editReply(`There was an error!\n\`\`\`${error}\`\`\``)
      console.log(`There was an error: ${error}`);
    }
  }
};
const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const { EmbedBuilder } = require('discord.js');

// spell-checker: disable
const items = {
  // UTILIDADES
  'colete': { type: 'utils', name: 'Colete' },
  // ARMAS
  'specialcarbinemk2': { type: 'gun', name: 'Carabina Especial (G3)' },
  'pistolmk2': { type: 'gun', name: 'Pistola MK2 (Five)' },
  'assaultsmg': { type: 'gun', name: 'SMG de Assalto (MTAR)' },
  // MUNIÇÃO
  'rifleammo': { type: 'ammo', name: 'Munição de Rifle (762)' },
  'pistolammo': { type: 'ammo', name: 'Munição de Pistola' },
  'subammo': { type: 'ammo', name: 'Munição de SubMetralhadora' },
  // FARM
  'pecadearma': { type: 'farm', name: 'Peça de Arma' },
  'gatilho': { type: 'farm', name: 'Gatilho' },
  'pistolbody': { type: 'farm', name: 'Corpo de Pistola' },
  'ferrolhodepistola': { type: 'farm', name: 'Ferrolho de Pistola' },
  'ferrolhodesmg': { type: 'farm', name: 'Ferrolho de SMG' },
  'placa-metal': { type: 'farm', name: 'Placa de Metal' },
  'aco': { type: 'farm', name: 'Aço' },
  'couro': { type: 'farm', name: 'Couro' },
  'zipper': { type: 'farm', name: 'Zipper' }
};
// spell-checker: enable

const event = (client, message) => {
  try {
    if (message.author.id === config.bot_webhook_chest && message.channel.id === config.logs_channel_chest) {
      const embed = message.embeds[0];
      if (!embed) return;
      
      const member = message.guild.members.cache.find(m => new RegExp(`\\b${embed.match(/\[ID\]:\s*(\d+)/)}$`).test(m?.displayName));

      const embedLog = new EmbedBuilder()
        .setAuthor({ name: 'Logs Baú - ' + config.name, iconURL: config.avatar })
        .setColor(embed.title.includes('guardado') ? '#00FF00' : '#FF0000')
        .setDescription(
          `*Item* ***${embed.title.includes('guardado') ? 'guardado no' : 'retirado do'}*** *baú!*\n` +

          `> ***Membro:*** *${member ? member.displayName : 'Não Encontrado - ' + embed.match(/\[ID\]:\s*(\d+)/)}*\n` +
          `> ***Item:*** *${embed.match(/\[ITEM\]:\s*(\d+)/)?.split(' ')[1]}*\n` +
          `> ***Quantidade:*** *${embed.match(/\[ITEM\]:\s*(\d+)/)?.split(' ')[0]}*\n`
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp();

      let channel = message.guild.channels.cache.find((c) => c.id === config.chest_channel_member);
      if (embed.match(/\[BAú\]:\s*(\d+)/) === 'Bairro49l') {
        channel = message.guild.channels.cache.find((c) => c.id === config.chest_channel_manager);
      } else if (embed.match(/\[BAú\]:\s*(\d+)/) === 'Bairro49ll') {
        channel = message.guild.channels.cache.find((c) => c.id === config.chest_channel_elite);
      }

      if (!channel) return;
      channel.send({ embeds: [ embedLog ] });
    }
  } catch (err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client))
      .catch((e) => message.channel.send(e));
  }
};

module.exports = event;
const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const { EmbedBuilder } = require('discord.js');

// spell-checker: disable
const chests = {
  'bairro49': { channel: config.chest_channel_member, name: 'Membro' },
  'bairro49l': { channel: config.chest_channel_manager, name: 'Gerência' },
  'bairro49ll': { channel: config.chest_channel_elite, name: 'Elite' }
};

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

const event = async(client, message) => {
  try {
    if (message.author.id === config.bot_webhook_chest && message.channel.id === config.logs_channel_chest) {
      const embed = message?.embeds[0]?.data;
      if (!embed) return;

      const lines = embed.description
        .replace(/```.*?(\n|$)/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .split('\n');

      const values = {
        type: embed.title.includes('guardado') ? 1 : 0
      };

      for (const line of lines) {
        const [ , key, value ] = line.match(/^\[(.+?)\]:\s*(.+)$/) || [];
        if (!key) continue;

        if (key === 'item') {
          const m = value.match(/^(\d+)x\s*(.+)$/i);
          values.quantidade = m ? Number(m[1]) : 1;
          values.item = m ? m[2] : value;
        } else {
          values[key] = value;
        }
      }

      values.bau = chests[values.bau] || { channel: '', name: values.bau };
      values.item = items[values.item] || { type: '', name: values.item };

      const member = message.guild.members.cache.find(m => new RegExp(`\\b${values.id}$`).test(m?.displayName));
      values.member = member ? member.displayName : 'Não Encontrado - ' + values.id; 

      const embedLog = new EmbedBuilder()
        .setAuthor({ name: 'Logs Baú - ' + config.name, iconURL: config.avatar })
        .setColor(values.type ? '#00FF00' : '#FF0000')
        .setDescription(
          `*Item* ${values.type ? '***guardado*** *no' : '***retirado*** *do'} baú!*\n\n` +

          `> *Baú:* ***${values.bau.name}***\n` +
          `> *Membro:* ***${values.member}***\n` +
          `> *Item:* ***${values.item.name}***\n` +
          `> *Quantidade:* ***x${values.quantidade}***\n`
        )
        .setTimestamp();

      const channel = message.guild.channels.cache.find((c) => c.id === (values.bau.channel || config.chest_channel_member));
      if (!channel) return;

      await channel.send({ embeds: [ embedLog ] }).catch(() => {});
    }
  } catch (err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client))
      .catch((e) => message.channel.send(e));
  }
};

module.exports = event;
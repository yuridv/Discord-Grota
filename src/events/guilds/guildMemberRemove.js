const { EmbedBuilder } = require('discord.js');

const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const event = async(client, member) => {
  try {
    const channel = await member.guild.channels.cache.get(config.logs_channel_exit);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Logs - ' + config.name, iconURL: config.avatar })
      .setColor('#FF0000')
      .setDescription(
        '__*Um usuário saiu do servidor!*__\n\n' +
        
        `> ***Usuário:*** *<@${member.user.id}>*\n` +
        `> ***Nome:*** *${member.user.tag}*\n` +
        `> ***Apelido:*** *${member.nickname}*\n` +
        `> ***ID do Discord:*** *${member.user.id}*\n`
      );

    await channel.send({ embeds: [ embed ] });

    const match = member.nickname?.match(/(\d+)$/);
    if (!match || !match[1]) return;

    const channelFarm = member.guild.channels.cache.find((c) => c.name.endsWith(match[1]) && c.name.includes('📁'));
    await channelFarm.delete().catch(() => {});
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client, member))
      .catch((e) => e);
  }
};

module.exports = event;
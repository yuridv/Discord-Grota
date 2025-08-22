const { EmbedBuilder } = require('discord.js');

const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const event = async(client, member) => {
  try {    
    await member.roles.add(config.role_random).catch(() => {});

    const channel = await member.guild.channels.cache.get(config.logs_channel_entry);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Logs - ' + config.name, iconURL: config.avatar })
      .setColor(config.color)
      .setDescription(
        '__*Um novo usuário entrou no servidor!*__\n\n' +
        
        `> ***Nome:*** *${member.user.tag}*\n` +
        `> ***ID do Discord:*** *${member.user.id}*\n` +
        `> ***Usuário:*** *<@${member.user.id}>*\n`
      );

    return channel.send({ embeds: [ embed ] });
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client, member))
      .catch((e) => e);
  }
};

module.exports = event;
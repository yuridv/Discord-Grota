const { Errors } = require('../../utils/functions');
const { MessageFlags } = require('discord.js');

const config = require('../../../config.json');

const command = async(client, interaction, args) => {
  try {
    await interaction.reply({ flags: MessageFlags.Ephemeral, content: '💿 | Enviando as mensagens de logs dos testes!' });

    const embed = {
      type: 'rich',
      title: 'Item(s) retirado(s) do baú',
      description: '```ini\n' +
        '[BAú]: Bairro49\n' +
        '[ID]: 14416\n' +
        '[ITEM]: 285.682x pecadearma\n' +
        '[COORDS]: 1274.09,-164.17,98.55\n' +
        '```',
      url: null,
      color: 12447888,
      timestamp: null,
      fields: [],
      thumbnail: null,
      image: null,
      video: null,
      author: null,
      provider: null,
      footer: {
        text: '25/08/2025 - 09:50:19',
        iconURL: undefined,
        proxyIconURL: undefined
      }
    };

    let message = await interaction.guild.channels.cache.get(config.logs_channel_chest).send({ embeds: [ embed ] });
    message.delete().catch(() => {});

    embed.title = 'Item(s) guardado(s) do baú';
    message = await interaction.guild.channels.cache.get(config.logs_channel_chest).send({ embeds: [ embed ] });
    message.delete().catch(() => {});
    
    embed.description = '```ini\n' +
      '[BAú]: Bairro49l\n' +
      '[ID]: 14416\n' +
      '[ITEM]: 1x subammo\n' +
      '[COORDS]: 1274.09,-164.17,98.55\n' +
      '```';
    message = await interaction.guild.channels.cache.get(config.logs_channel_chest).send({ embeds: [ embed ] });
    message.delete().catch(() => {});

    embed.title = 'Item(s) retirado(s) do baú';
    message = await interaction.guild.channels.cache.get(config.logs_channel_chest).send({ embeds: [ embed ] });
    message.delete().catch(() => {});

    embed.description = '```ini\n' +
      '[BAú]: Bairro49ll\n' +
      '[ID]: 14416\n' +
      '[ITEM]: 1x subammo\n' +
      '[COORDS]: 1274.09,-164.17,98.55\n' +
      '```';
    message = await interaction.guild.channels.cache.get(config.logs_channel_chest).send({ embeds: [ embed ] });
    message.delete().catch(() => {});

    embed.title = 'Item(s) guardado(s) do baú';
    message = await interaction.guild.channels.cache.get(config.logs_channel_chest).send({ embeds: [ embed ] });
    message.delete().catch(() => {});
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.guild.channels.cache.get(config.logs_channel_chest).send({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '🎉 [Testes] 🎉 | Comando para testes de carregamento.'
};
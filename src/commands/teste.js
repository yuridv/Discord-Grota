const { Errors } = require('../utils/functions');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const config = require('../../config.json');

const command = async(client, interaction, args) => {
  try {
    const register = new ButtonBuilder()
      .setCustomId('test')
      .setEmoji('🤡')
      .setLabel('Botão de teste')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(register);

    // const embed = new EmbedBuilder()
    //   .setDescription('Comando de teste');

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Registro - ' + config.name, iconURL: config.avatar })
      .setColor(config.color)
      .setDescription(
        '__*Um novo usuário efetuou o registro!*__\n\n' +
        '> ***ID:*** *14416*\n' +
        '> ***Nome e Sobrenome:*** *Dragon Pearson*\n' +
        '> ***Número de Telefone:*** *551-562*\n' +
        '> ***ID do Recrutador:*** *4987 - <@1254227569902096485>*\n'
      )
      .setFields({ name: '> ***• Quem Aprovou:***', value: '> *Terrão / 4987 - <@1254227569902096485>*' });

    return interaction.reply({
      embeds: [ embed ],
      components: [ row ],
      flags: MessageFlags.Ephemeral
    });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '🎉 [Testes] 🎉 | Comando para testes de carregamento.'
};
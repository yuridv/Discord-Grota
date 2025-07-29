const { Errors } = require('../utils/functions');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const command = async(client, interaction, args) => {
  try {
    const register = new ButtonBuilder()
      .setCustomId('test')
      .setEmoji('🤡')
      .setLabel('Botão de teste')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(register);

    const embed = new EmbedBuilder()
      .setDescription('Comando de teste');

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
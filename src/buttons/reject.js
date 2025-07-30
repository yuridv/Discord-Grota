const { MessageFlags, ChannelType, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const { Errors } = require('../utils/functions');
const config = require('../../config.json');

const asks = [
  { type: 'id', msg: '• *Qual o seu* ***ID*** *dentro da cidade?*' },
  { type: 'name', msg: '• *Qual o seu* ***Nome e Sobrenome*** *dentro da cidade?*' },
  { type: 'phone', msg: '• *Qual o seu* ***Número de Telefone*** *dentro da cidade?*' },
  { type: 'recruiter', msg: '• *Qual o* ***ID*** *de quem te* ***Recrutou*** *dentro da cidade?*' }
];

const ordinais = {
  1: 'Primeira',
  2: 'Segunda',
  3: 'Terceira',
  4: 'Quarta',
  5: 'Quinta',
  6: 'Sexta',
  7: 'Sétima',
  8: 'Oitava',
  9: 'Nona'
};

const command = async(client, interaction, args) => {
  try {
    const embedEdited = EmbedBuilder.from(interaction.message.embeds[0])
      .setColor('#FF0000');

    const user = await interaction.guild.members.cache.get(args[1]);
    if (!user) return interaction.update({ embeds: [ embedEdited ], components: [] }).catch(() => {});

    await user.kick('Registro reprovado').catch(() => {});

    return interaction.update({ embeds: [ embedEdited ], components: [] }).catch(() => {});
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command
};
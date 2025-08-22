const { MessageFlags, EmbedBuilder } = require('discord.js');

const { Errors } = require('../utils/functions');

const command = async(client, interaction, args) => {
  try {
    const embedEdited = EmbedBuilder.from(interaction.message.embeds[0])
      .setFields({ name: '> ***• Quem Rejeitou:***', value: `> *${interaction.member.nickname} - <@${interaction.user.id}>*` })
      .setColor('#FF0000');

    await interaction.update({ embeds: [ embedEdited ], components: [] }).catch(() => {});

    const user = await interaction.guild.members.cache.get(args[0]);
    if (!user) return;

    await user.kick('Registro reprovado').catch(() => {});

    return;
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command
};
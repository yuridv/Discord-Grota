const { MessageFlags, EmbedBuilder } = require('discord.js');

const { Errors } = require('../utils/functions');

const command = async(client, interaction, args) => {
  try {
    const embedEdited = EmbedBuilder.from(interaction.message.embeds[0])
      .setColor('#FF0000');

    const user = await interaction.guild.members.cache.get(args[0]);
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
const { MessageFlags, EmbedBuilder, ChannelType, PermissionFlagsBits, IntentsBitField } = require('discord.js');

const { Errors } = require('../utils/functions');
const config = require('../../config.json');

const command = async(client, interaction, args) => {
  try {
    const embedEdited = EmbedBuilder.from(interaction.message.embeds[0])
      .setFields({ name: '> ***• Quem Aprovou:***', value: `*__${interaction.member.nickname} - <@${interaction.user.id}>__*` })
      .setColor('#00FF00');

    await interaction.update({ embeds: [ embedEdited ], components: [] }).catch(() => {});

    const user = await interaction.guild.members.cache.get(args[0]);
    if (!user) return;

    await user.setNickname(args[2] + ' / ' + args[1]).catch(() => {});

    await user.roles.add(config.role_member).catch(() => {});
    await user.roles.remove(config.role_random).catch(() => {});

    const verify = interaction.guild.channels.cache.find((c) => c.name === `📁・${args[2]}-${args[1]}`);
    if (!verify) {
      const channel = await interaction.guild.channels.create({
        name: `📁・${args[2]}-${args[1]}`,
        type: ChannelType.GuildText,
        parent: config.farm_category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [ PermissionFlagsBits.ViewChannel ] },
          { id: user.id, allow: [ PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages ] },
          { id: config.role_manager_farm, allow: [ PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages ] }
        ]
      }).catch(() => {});

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Registro - ' + config.name, iconURL: config.avatar })
        .setColor(config.color)
        .setDescription(
          '*__Esse chat é usado para você enviar fotos da sua farm diária__*' +
          
          '\n\n> **Importante:**' +
          '\n» *Obrigatório no mínimo* ***800*** *farm de cada item por* ***DIA!***' +
          '\n» *A cada* ***800 PEÇAS DE ARMA*** *você ganha* ***R$ 100.000!***' +
          '\n» *Após colocar a farm no baú, encaminhe a* ***LOG*** *nesse canal!*' +
          '\n» *Tire foto da tela inteira antes de colocar a* ***FARM*** *no baú!*' +
          '\n» *Anexe as fotos junto com o modelo abaixo da contagem dos itens!*' +

          '\n\n> **Modelo da contagem:**' +
          '\n・ Peças de Arma: **800**' +

          '\n\n***Fotos fora do padrão ou com farm incompleto não serão aceitos!***' +
          '\n\n***Tutorial das Logs: __https://files.catbox.moe/p9xo15.mp4__!***' +

          '\n\n*__Atenciosamente Grota・Meta City__*'
        );

      await channel.send({ content: `<@${user.id}> - <@&${config.role_manager_farm}>`, embeds: [ embed ] });
    }

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
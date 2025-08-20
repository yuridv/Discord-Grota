const { EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)) {
      return interaction.reply({ flags: MessageFlags.Ephemeral, content: 'Você não possui permissão de administrador para utilizar esse comando!' });
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Farm - ' + config.name, iconURL: config.avatar })
      .setColor(config.color)
      .setDescription(
        '*__Esse chat é usado para você enviar fotos da sua farm diária__*' +
        
        '\n\n> **Importante:**' +
        '\n» *Obrigatório no mínimo* ***800*** *farm de cada item por* ***DIA***' +
        '\n» *A cada* ***800 PEÇAS DE ARMA*** *você ganha* ***R$ 100.000*** ***(NÃO É ACUMULATIVO)***' +
        '\n» *Após colocar a farm no baú, encaminhe a* ***LOG*** *do servidor* ***FACÇÕES*** *nesse canal!*' +
        '\n» *Tire foto da tela inteira antes de colocar os itens no baú, caso ainda não tenha acesso as* ***LOGs!***' +
        '\n» *Anexe as fotos junto com o modelo abaixo da contagem dos itens!*' +

        '\n\n> **Modelo da contagem:**' +
        '\n・ Peças de Arma: **800**' +

        '\n\n***Fotos fora do padrão ou com farm incompleto não serão aceitos!***' +
        '\n\n*__Atenciosamente Grota・Meta City__*'
      );

    return interaction.reply({
      embeds: [ embed ]
    });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '🎉 [Mensagens] 🎉 | Comando para gerar a mensagem de farm para todos os canais.'
};
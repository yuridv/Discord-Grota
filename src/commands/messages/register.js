const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags, PermissionFlagsBits } = require('discord.js');

const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)) {
      return interaction.reply({ flags: MessageFlags.Ephemeral, content: 'Você não possui permissão de administrador para utilizar esse comando!' });
    }

    const register = new ButtonBuilder()
      .setCustomId('register')
      .setEmoji('✨')
      .setLabel('Fazer o Registro')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder()
      .addComponents(register);

    const embed = new EmbedBuilder()
      .setAuthor({ name: config.name, iconURL: config.avatar })
      .setThumbnail(config.avatar)
      .setColor(config.color)
      .setDescription(
        '*Seja bem vindo há nossa facção* ***GROTA*** *da cidade* ***Meta-City***!' +
        '\n*Você precisa fazer o seu registro para poder visualizar os outros chats!*' +
        
        '\n\n> **Como se registrar?**' +
        '\n1º Clique no botão abaixo **"Fazer o Registro"**' +
        '\n2º Será criado um chat você responder algumas perguntas!' +
        '\n3º Você precisará informar o seu **ID** da cidade!' +
        '\n4º Você precisará informar o seu **Nome e Sobrenome** da cidade!' +
        '\n5º Você precisará informar o seu **Número de Telefone** da cidade!' +
        '\n6º Você precisará informar o **ID** de quem te **Recrutou**!' +
        '\n7º Você precisará entrar no servidor **Facções**!' +

        '\n\n> **Informações**' +
        '\n• *Após fazer o seu registro, você precisa aguardar até que um dos nossos gerentes possa aprovar o seu registro!*' +

        '\n\n*__Atenciosamente Grota・Meta City__*'
      );

    return interaction.reply({
      embeds: [ embed ],
      components: [ row ]
    });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '🎉 [Mensagens] 🎉 | Comando para gerar a mensagem de registro.'
};
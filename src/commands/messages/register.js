const { Errors } = require('../../utils/functions');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');

const command = async(client, interaction, args) => {
  try {
    const register = new ButtonBuilder()
      .setCustomId('register')
      .setEmoji('✨')
      .setLabel('Fazer o Registro')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder()
      .addComponents(register);

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Grota・Meta City', iconURL: 'https://media.discordapp.net/attachments/1362573683767640215/1399820068686270484/logo_grota.png?ex=688a6387&is=68891207&hm=e4117c2559984dd42106bfff2d731c5cd3e5eb2d0f74c26c21d6db00074e3083&=&format=webp' })
      .setThumbnail('https://media.discordapp.net/attachments/1362573683767640215/1399820068686270484/logo_grota.png?ex=688a6387&is=68891207&hm=e4117c2559984dd42106bfff2d731c5cd3e5eb2d0f74c26c21d6db00074e3083&=&format=webp')
      .setColor('#F3A500')
      .setDescription(
        '*Seja bem vindo há nossa facção* ***GROTA*** *da cidade* ***Meta-City***!' +
        '\n*Você precisa fazer o seu registro para poder visualizar os outros chats!*' +
        
        '\n\n> **Como se registrar?**' +
        '\n1º Clique no botão abaixo **"Fazer o Registro"**' +
        '\n2º Será criado um chat aonde será feitos perguntas para você responder!' +
        '\n3º Você precisará escrever o seu **ID** no chat!' +
        '\n4º Você precisará escrever o seu **Nome** e **Sobrenome** no chat!' +
        '\n5º Você precisará escrever o **ID** de quem te **recrutou**!' +

        '\n\n> **Informações**' +
        '\n• Após fazer o seu registro, você precisa aguardar até que um dos nossos gerentes possa aprovar o seu registro!' +

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
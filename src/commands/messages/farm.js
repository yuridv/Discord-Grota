const { EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)) {
      return interaction.reply({ flags: MessageFlags.Ephemeral, content: 'Você não possui permissão de administrador para utilizar esse comando!' });
    }
    
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const channels = await interaction.guild.channels.cache.filter((channel) => channel.parentId === config.farm_category);

    await interaction.guild.members.fetch();



    for (const channel of channels) {
      const id = channel[1].name.match(/\d+$/);
      if (id) {
        const member = interaction.guild.members.cache.find(m => new RegExp(`\\b${id[0]}$`).test(m?.displayName));
        if (!member) {
          await channel[1].delete();
          continue;
        }

        await channel[1].setName(`📁・${member.displayName.replace('/','-').replace('|','-')}`);

        const embed = new EmbedBuilder()
          .setAuthor({ name: 'Farm - ' + config.name, iconURL: config.avatar })
          .setColor(config.color)
          .setDescription(
            '*__Esse chat é usado para você enviar fotos da sua farm diária__*' +
            
            '\n\n> **Importante:**' +
            '\n» *Obrigatório no mínimo* ***800*** *farm de cada item por* ***DIA***' +
            '\n» *A cada* ***800 PEÇAS DE ARMA*** *você ganha* ***R$ 100.000***' +
            '\n» *Após colocar a farm no baú, encaminhe a* ***LOG*** *nesse canal!*' +
            '\n» *Tire foto da tela inteira antes de colocar a* ***FARM*** *no baú!*' +
            '\n» *Anexe as fotos junto com o modelo abaixo da contagem dos itens!*' +

            '\n\n> **Modelo da contagem:**' +
            '\n・ Peças de Arma: **800**' +

            '\n\n***Fotos fora do padrão ou com farm incompleto não serão aceitos!***' +
            '\n\n***Tutorial das Logs: __https://files.catbox.moe/p9xo15.mp4__!***' +

            '\n\n*__Atenciosamente Grota・Meta City__*'
          );

        await channel[1].send({
          content: `<@${member.user.id}> - <@&${config.gerente_farm_role}>`,
          embeds: [ embed ]
        });
      }
    }
    
    return interaction.editReply({ content: 'A mensagem de farm foi enviada em todos os canais com sucesso!' });
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
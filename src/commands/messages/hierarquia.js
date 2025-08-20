const { EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)) {
      return interaction.reply({ flags: MessageFlags.Ephemeral, content: 'Você não possui permissão de administrador para utilizar esse comando!' });
    }

    const role_01 = interaction.guild.roles.cache.get(config.role_01);
    const role_02 = interaction.guild.roles.cache.get(config.role_02);
    const role_03 = interaction.guild.roles.cache.get(config.role_03);
    const role_manager_general = interaction.guild.roles.cache.get(config.role_manager_general);
    const role_manager_action = interaction.guild.roles.cache.get(config.role_manager_action);
    const role_manager_sales = interaction.guild.roles.cache.get(config.role_manager_sales);
    const role_manager_farm = interaction.guild.roles.cache.get(config.role_manager_farm);
    const role_manager_recruitment = interaction.guild.roles.cache.get(config.role_manager_recruitment);
    const role_manager_partnership = interaction.guild.roles.cache.get(config.role_manager_partnership);
    const role_elite = interaction.guild.roles.cache.get(config.role_elite);

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Hierarquia - ' + config.name, iconURL: config.avatar })
      .setColor(config.color)
      .setDescription(
        '*__Essa é a lista da hierarquia da facção!__*\n' +
        '*__Respeite a hierarquia, caso o contrario você será punido!__*'
      )
      .setFields(
        { name: '> ***__Líderes (01):__***', value: role_01.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Sub Líderes (02):__***', value: role_02.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Líder Auxiliar (03):__***', value: role_03.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Gerente Geral:__***', value: role_manager_general.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Gerente de Ação:__***', value: role_manager_action.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Gerente de Vendas:__***', value: role_manager_sales.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Gerente de Farm:__***', value: role_manager_farm.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Gerente de Recrutamento:__***', value: role_manager_recruitment.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Gerente de Parceria:__***', value: role_manager_partnership.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') },
        { name: '> ***__Membros da Elite:__***', value: role_elite.members.map((member) => `・${member.nickname} - <@${member.user.id}>` ).join('\n') }
      );

    return interaction.reply({
      content: '@everyone',
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
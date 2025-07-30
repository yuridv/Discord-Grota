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

const command = async(client, interaction) => {
  try {
    const verify = interaction.guild.channels.cache.find((c) => c.name === `✏️・registro-${interaction.user.id}`);
    if (verify) return interaction.reply({ content: `❌ ・ Você já possui um canal de registro aberto: ${verify}`, flags: MessageFlags.Ephemeral });

    const channel = await interaction.guild.channels.create({
      name: `✏️・registro-${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: config.register_category,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [ PermissionFlagsBits.ViewChannel ] },
        { id: interaction.user.id, allow: [ PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages ] }
      ]
    });

    setTimeout(() => channel.delete().catch(() => {}), 5 * 60 * 1000);

    await interaction.reply({
      content: `✅ ・ Foi criado um **canal** para você fazer o seu registro ${channel}`,
      flags: MessageFlags.Ephemeral
    });

    const result = {};
    for (let i = 0; i < asks.length; i++) {
      let description = '';
      if (i === 0) description += '> *__Seja bem vindo ao nosso sistema de registro!__*\n\n`Você tem 5 minutos para responder as perguntas!`\n`Somente você e o bot tem acesso a este canal!`\n\n';
      description += `> **${ordinais[i + 1]} Pergunta:**\n${asks[i].msg}`;

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Registro - ' + config.name, iconURL: config.avatar })
        .setColor(config.color)
        .setDescription(description);

      const ask = await channel.send({ content: `<@${interaction.user.id}>`, embeds: [ embed ] });

      try {
        const collected = await channel.awaitMessages({
          filter: m => m.author.id === interaction.user.id,
          max: 1,
          time: 5 * 60 * 1000,
          errors: [ 'time' ]
        });

        const msg = collected.first();
        result[asks[i].type] = msg.content;

        await msg.delete().catch(() => {});
        await ask.delete().catch(() => {});
      } catch(err) {
        return channel.delete().catch(() => {});
      }
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Registro - ' + config.name, iconURL: config.avatar })
      .setColor(config.color)
      .setDescription(
        '> __*Você finalizou o seu registro com sucesso!*__' +
        '\n\n`Aguarde até que um dos nossos gerente aprove o seu registro...`' +
        '\n\n*__Atenciosamente Grota・Meta City__*'
      );
    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [ embed ] });

    setTimeout(() => channel.delete().catch(() => {}), 10 * 1000);

    let answers = '';
    for (let i = 0; i < asks.length; i++) {
      answers += `\n> ${asks[i].msg}\n**${result[asks[i].type]}**\n`;
    }

    const approve = new ButtonBuilder()
      .setCustomId('approve')
      .setEmoji('✔️')
      .setLabel('Aprovar')
      .setStyle(ButtonStyle.Success);

    const reject = new ButtonBuilder()
      .setCustomId('reject')
      .setEmoji('✖️')
      .setLabel('Rejeitar')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(approve, reject);

    const approval = new EmbedBuilder()
      .setAuthor({ name: 'Registro - ' + config.name, iconURL: config.avatar })
      .setColor(config.color)
      .setDescription(
        '__*Um novo usuário efetuou o registro!*__\n\n' +
        answers
      );

    await interaction.guild.channels.cache.find((c) => c.id === config.approval_channel).send({ content: `<@${interaction.user.id}>`, embeds: [ approval ], components: [ row ] });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '🎉 [Mensagens] 🎉 | Comando para gerar a mensagem de registro.'
};
const { Errors } = require('../utils/functions');
const { MessageFlags, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const command = async(client, interaction) => {
  try {
    const verify = interaction.guild.channels.cache.find((c) => c.name === `✏️・registro-${interaction.user.id}`);
    if (verify) return interaction.reply({ content: `❌ ・ Você já possui um canal de registro aberto: ${verify}`, flags: MessageFlags.Ephemeral });

    const channel = await interaction.guild.channels.create({
      name: `✏️・registro-${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: '1399828549371691162',
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

    let embed = new EmbedBuilder()
      .setAuthor({ name: 'Registro GROTA・Meta City', iconURL: 'https://media.discordapp.net/attachments/1362573683767640215/1399820068686270484/logo_grota.png?ex=688a6387&is=68891207&hm=e4117c2559984dd42106bfff2d731c5cd3e5eb2d0f74c26c21d6db00074e3083&=&format=webp' })
      .setColor('#F3A500')
      .setDescription(
        '> *__Seja bem vindo ao nosso sistema de registro!__*' +

        '\n\n`Você tem 5 minutos para responder as perguntas, somente você e o bot tem acesso a este canal!`' +

        '\n\n> **Primeira Pergunta:**' +
        '\n• *Qual o seu ID dentro da cidade?*' +

        '\n\n*__Atenciosamente Grota・Meta City__*'
      );
    
    let ask = await channel.send({ content: `<@${interaction.user.id}>`, embeds: [ embed ] });

    const filter = m => m.author.id === interaction.user.id;
    let collector = channel.createMessageCollector({ filter, max: 1, time: 15000 });

    collector.on('collect', async msg => {
      const ID = msg.content;

      await msg.delete();
      await ask.delete().catch(() => {});

      embed = new EmbedBuilder()
        .setAuthor({ name: 'Registro GROTA・Meta City', iconURL: 'https://media.discordapp.net/attachments/1362573683767640215/1399820068686270484/logo_grota.png?ex=688a6387&is=68891207&hm=e4117c2559984dd42106bfff2d731c5cd3e5eb2d0f74c26c21d6db00074e3083&=&format=webp' })
        .setColor('#F3A500')
        .setDescription(
          '> **Segunda Pergunta:**' +
          '\n• *Qual o seu* ***Nome*** *e* ***Sobrenome*** *dentro da cidade?*'
        );

      ask = await channel.send({ content: `<@${interaction.user.id}>`, embeds: [ embed ] });

      collector = channel.createMessageCollector({ filter, max: 1, time: 15000 });

      collector.on('collect', async msg => {
        const USER = msg.content;

        await msg.delete();
        await ask.delete().catch(() => {});

        embed = new EmbedBuilder()
          .setAuthor({ name: 'Registro GROTA・Meta City', iconURL: 'https://media.discordapp.net/attachments/1362573683767640215/1399820068686270484/logo_grota.png?ex=688a6387&is=68891207&hm=e4117c2559984dd42106bfff2d731c5cd3e5eb2d0f74c26c21d6db00074e3083&=&format=webp' })
          .setColor('#F3A500')
          .setDescription(
            '> **Terceira Pergunta:**' +
            '\n• *Qual o* ***ID*** *de quem te recrutou?*'
          );

        ask = await channel.send({ content: `<@${interaction.user.id}>`, embeds: [ embed ] });
      });
      

    });

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
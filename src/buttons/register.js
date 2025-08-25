const { MessageFlags, ChannelType, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const { Errors } = require('../utils/functions');
const config = require('../../config.json');

const asks = [
  { id: 'id', msg: '• *Qual o seu* ***ID*** *dentro da cidade?*' },
  { id: 'name', msg: '• *Qual o seu* ***Nome e Sobrenome*** *dentro da cidade?*' },
  { id: 'phone', msg: '• *Qual o seu* ***Número de Telefone*** *dentro da cidade?*' },
  { id: 'recruiter', msg: '• *Qual o* ***ID*** *de quem te* ***Recrutou*** *dentro da cidade?*' },
  { id: 'factions', msg: '• *Entre no servidor de Facções:* ***https://discord.gg/c8KjSDpXNk***\n*Após entrar, responda* ***"sim"*** *aqui no chat!*' }
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
        { id: config.role_manager_recruitment, allow: [ PermissionFlagsBits.ViewChannel ] },
        { id: interaction.user.id, allow: [ PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages ] }
      ]
    });

    setTimeout(() => channel.delete().catch(() => {}), 5 * 60 * 1000);

    await interaction.guild.members.fetch();

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

      let response_error;
      const waitMessage = async() => {
        try {
          const collected = await channel.awaitMessages({
            filter: m => m.author.id === interaction.user.id,
            max: 1,
            time: 5 * 60 * 1000,
            errors: [ 'time' ]
          });

          const msg = collected.first();
          await msg.delete().catch(() => {});
          if (response_error) await response_error.delete().catch(() => {});
          
          if (asks[i].id === 'id' && (!Number(msg.content) || String(msg.content).length > 5)) {
            response_error = await channel.send({ content: `🚫 | <@${interaction.user.id}> O seu **ID** precisa ser apenas **números**, e conter no máximo **5** dígitos!\n> ・ ***Exemplo:*** *__123456__*` }).catch(() => {});
            return waitMessage();
          } else if (asks[i].id === 'name' && (String(msg.content).length > 24 || !String(msg.content).includes(' '))) {
            response_error = await channel.send({ content: `🚫 | <@${interaction.user.id}> Você precisa por o **nome** e **sobrenome**, e conter no máximo **24** caracteres!\n> ・ ***Exemplo:*** *__João Silva__*` }).catch(() => {});
            return waitMessage();
          } else if (asks[i].id === 'phone') {
            if (!Number(msg.content.replace('-','')) || (String(msg.content.replace('-','')).length !== 6 && String(msg.content.replace('-','')).length !== 3)) {
              response_error = await channel.send({ content: `🚫 | <@${interaction.user.id}> O seu **telefone** precisa conter apenas **números** e **-**, e conter **6** ou **3** números!\n> ・ ***Exemplo:*** *__123-456__*` }).catch(() => {});
              return waitMessage();
            }

            if (msg.content.replace('-','').length === 6) {
              msg.content = msg.content.replace('-','').slice(0, 3) + '-' + msg.content.replace('-','').slice(3);
            }
          } else if (asks[i].id === 'recruiter') {
            if (!Number(msg.content) || String(msg.content).length > 5) {
              response_error = await channel.send({ content: `🚫 | <@${interaction.user.id}> O **ID** do recrutador precisa ser apenas **números**, e conter no máximo **5** dígitos!\n> ・ ***Exemplo:*** *__123456__*` }).catch(() => {});
              return waitMessage();
            }

            const member = interaction.guild.members.cache.find(m => new RegExp(`\\b${msg.content}$`).test(m?.displayName) && m?.roles.cache.has(config.role_manager_recruitment));
            if (!member) {
              response_error = await channel.send({ content: `🚫 | <@${interaction.user.id}> Não encontrei nenhum **recrutador** com esse **ID** aqui dentro do servidor!` }).catch(() => {});
              return waitMessage();
            }

            msg.content = msg.content + ` - ${member.nickname} - <@${member.user.id}>`;
          } else if (asks[i].id === 'factions') {
            if (msg.content !== 'sim' && msg.content !== 'Sim') {
              response_error = await channel.send({ content: `🚫 | <@${interaction.user.id}> *Entre no servidor de* ***Facções*** *e responda apenas* ***"Sim"***` }).catch(() => {});
              return waitMessage();
            }
          }


          result[asks[i].id] = msg.content;

          await ask.delete().catch(() => {});
        } catch(err) {
          return channel.delete().catch(() => {});
        }
      };

      await waitMessage();
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

    const approve = new ButtonBuilder()
      .setCustomId(`approve-${interaction.user.id}-${result.id}-${result.name}`)
      .setEmoji('✔️')
      .setLabel('Aprovar')
      .setStyle(ButtonStyle.Success);

    const reject = new ButtonBuilder()
      .setCustomId(`reject-${interaction.user.id}`)
      .setEmoji('✖️')
      .setLabel('Rejeitar')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(approve, reject);

    const channelApproval = interaction.guild.channels.cache.find((c) => c.id === config.register_channel_approval);
    if (!channelApproval) return;

    const approval = new EmbedBuilder()
      .setAuthor({ name: 'Registro - ' + config.name, iconURL: config.avatar })
      .setColor(config.color)
      .setDescription(
        '__*Um novo usuário efetuou o registro!*__\n\n' +
        
        `> ***ID:*** *${result[asks[0].id]}*\n` +
        `> ***Nome e Sobrenome:*** *${result[asks[1].id]}*\n` +
        `> ***Número de Telefone:*** *${result[asks[2].id]}*\n` +
        `> ***ID do Recrutador:*** *${result[asks[3].id]}*\n` +

        '\n> ***Solicitar SET:***\n' +
        '```' +
        `Discord: <@${interaction.user.id}>\n` +
        `Nome e ID: ${result[asks[1].id]} / ${result[asks[0].id]}\n` +
        'Cargo: Membro\n' +
        'Bairro: 49' +
        '```'
      );

    return channelApproval.send({ content: `*<@&${config.role_manager_recruitment}>, O usuário <@${interaction.user.id}>, efetuou um novo registro!*`, embeds: [ approval ], components: [ row ] });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command
};
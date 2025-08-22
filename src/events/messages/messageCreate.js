const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const { WebhookClient, EmbedBuilder } = require('discord.js');

const event = (client, message) => {
  try {
    if (message.author.id === config.bot_webhook_chest && message.channel.id === config.logs_channel_chest) {
      console.log('LOG CHEST');
    }
  } catch (err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client))
      .catch((e) => message.channel.send(e));
  }
};

module.exports = event;
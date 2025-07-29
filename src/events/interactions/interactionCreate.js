const { Errors } = require('../../utils/functions');

const event = async(client, interaction) => {
  try {    
    if (interaction.isChatInputCommand()) {
      const command = client.commands.find(r => r.name === interaction.commandName);
      if (!command || !command.route) return;
      
      const args = interaction.options._hoistedOptions;
      await command.route(client, interaction, args);
    } else if (interaction.isButton()) {
      const button = client.buttons.find(r => r.name === interaction.customId);
      if (!button || !button.route) return;

      await button.route(client, interaction);
    }

  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client, interaction))
      .catch((e) => e);
  }
};

module.exports = event;
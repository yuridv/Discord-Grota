const { Errors } = require('../../utils/functions');
const config = require('../../../config.json');

const event = async(client, member) => {
  try {    
    await member.roles.add(config.role_random).catch(() => {});
  } catch(err) {
    return Errors(err, `Event ${__filename}`)
      .then(() => event(client, member))
      .catch((e) => e);
  }
};

module.exports = event;
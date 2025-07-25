require('dotenv-safe').config();

const { base, colors } = require('./src/utils/bases');
const { Files } = require('./src/utils/functions');

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

console.log(colors.YELLOW + '[Discord.JS]=> Starting...' + colors.RESET);

base.client = new Client({
  status: 'online',
  autoReconnect: true,
  interval: 60,
  retryLimit: 35,
  afk: false,
  compress: true,
  intents: [ 
    GatewayIntentBits.MessageContent, // INTENT PRIVADA - GET MESSAGES
    GatewayIntentBits.GuildPresences, // INTENT PRIVADA - GET MEMBERS
    GatewayIntentBits.Guilds, // INTENT PRIVADA - GET GUILDS DADOS
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});


const Events = Files('./src/events/', { removeDir: 1 });
for (const e in Events) base.client.on(e, Events[e].bind(null, base.client));

base.client.commands = [];
const Commands = Files('./src/commands/', { removeDir: 1 });
for (const c in Commands) base.client.commands.push({ name: c, ...Commands[c] });

base.client.login(process.env.BOT_TOKEN)
  .then(() => {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    rest.put(Routes.applicationCommands(base.client.user.id), { body: base.client.commands });
  })
  .catch((err) => console.log('[Discord]=> Login Error: ', err));
require('dotenv').config();
const Telegraf = require('telegraf');
const commands = require('./commands');

const { URL, PORT = '5000' } = process.env;
const bot = new Telegraf(process.env.BOT_TOKEN);

Object.values(commands).map((command) => command(bot));

if (URL) {
  bot.launch({
    webhook: {
      domain: URL,
      port: PORT,
    },
  });
} else {
  bot.launch();
}

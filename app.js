require('dotenv').config();
const Telegraf = require('telegraf');
const commands = require('./commands');

const { URL, PORT = '5000', BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN);

Object.values(commands).map((command) => command(bot));
console.log(URL);
console.log(PORT);


bot.on('callback_query', async ({ update, deleteMessage }, next) => {
  await deleteMessage(update.callback_query.message.message_id);
  next();
});

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

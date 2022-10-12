import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import reports from './modules/reports/reports.js';
import { opensource } from './modules/opensource/opensource.js';

dotenv.config();

const {
  BOT_TOKEN,
} = process.env;

const bot = new Telegraf(BOT_TOKEN);

bot.on('callback_query', async (ctx, next) => {
  await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  return next();
});

reports(bot);
opensource(bot);

bot.launch();

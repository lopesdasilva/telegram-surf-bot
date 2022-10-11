import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import reports from './modules/reports/reports.js';
import { opensource } from './modules/opensource/opensource.js';

dotenv.config();

const {
  BOT_TOKEN,
} = process.env;

const bot = new Telegraf(BOT_TOKEN);

reports(bot);
opensource(bot);

bot.launch();

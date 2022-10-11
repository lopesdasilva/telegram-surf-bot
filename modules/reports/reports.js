import Telegraf from 'telegraf';
import buildReport from '../../reports/Beach.js';
import { getFullList, getIMPAReportRequest } from './api/BeachCam.js';
import { groupBy } from './utils.js';

const { Markup } = Telegraf;

async function getIpmaReport(spot, ctx) {
  const ipmaReport = await getIMPAReportRequest(spot.Id);
  const replyMarkup = buildReport({ spot, ipmaReport });
  await ctx.reply(
    replyMarkup,
    { parse_mode: 'Markdown' },
  );
}

const replySpot = (app, spot) => {
  app.action(spot.Title, async (ctx) => {
    const loading = await ctx.reply('Loading ...');
    await getIpmaReport(spot, ctx);
    ctx.deleteMessage(loading.message_id);
  });
};

const replyArea = (app, {
  caption,
  spots,
}) => {
  spots.forEach((spot) => replySpot(app, spot));
  const replies = spots.map((spot) => Markup.button.callback(
    spot.Title,
    spot.Title,
  ));

  app.action(caption, async (ctx) => {
    ctx.reply(
      'Choose a spot:',
      Markup.inlineKeyboard(replies, {
        columns: 2,
      }).oneTime(),
    );
  });

  // .extra()
  // .oneTime()
};
const reports = (app) => app.command('report', async (ctx) => {
  const loading = await ctx.reply('Loading ...');
  const { Livecams = [] } = await getFullList();
  const lives = groupBy(Livecams, 'ZoneCode');
  const areas = Object.keys(lives);
  ctx.deleteMessage(loading.message_id);

  areas.forEach((area) => replyArea(app, {
    caption: area,
    spots: lives[area],
  }));

  const replies = areas.map((area) => Markup.button.callback(
    area,
    area,
  ));

  return ctx.reply(
    'Choose an Area:',
    Markup.inlineKeyboard(replies, {
      columns: 2,
    })

      // .extra()
      .oneTime(),
  );
});

export default reports;

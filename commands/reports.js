const { Markup } = require('telegraf');

const { BeachReport } = require('../reports/Beach');
const { getFullList, getIMPAReportRequest } = require('../api/BeachCam');


const {
  REPORTS,
} = require('../constants');
const { groupBy } = require('../utils/utils');


async function getIpmaReport(spot, reply) {
  const ipmaReport = await getIMPAReportRequest(spot.Id);
  const replyMarkup = BeachReport({ spot, ipmaReport });
  await reply(replyMarkup,
    { parse_mode: 'Markdown' });
}

const replySpot = (app, spot) => {
  app.action(spot.Title, async ({
    deleteMessage,
    reply,
  }) => {
    const loading = await reply('Loading ...');
    await getIpmaReport(spot, reply);
    deleteMessage(loading.message_id);
  });
};


const replyArea = (app, {
  caption,
  spots,
}) => {
  spots.forEach((spot) => replySpot(app, spot));
  const replies = spots.map((spot) => Markup.callbackButton(spot.Title,
    spot.Title));
  app.action(caption, ({ reply }) => reply('Choose a spot:',
    Markup.inlineKeyboard(replies, {
      columns: 2,
    })
      .removeKeyboard(true)
      .oneTime()
      .extra()));
};


const reports = (app) => app.command(REPORTS, async ({
  deleteMessage,
  reply,
}) => {
  const loading = await reply('Loading ...');
  const { Livecams = [] } = await getFullList();
  const lives = groupBy(Livecams, 'ZoneCode');
  const areas = Object.keys(lives);
  deleteMessage(loading.message_id);

  areas.forEach((area) => replyArea(app, {
    caption: area,
    spots: lives[area],
  }));

  const replies = areas.map((area) => Markup.callbackButton(area,
    area));

  return reply('Choose an Area:',
    Markup.inlineKeyboard(replies, {
      columns: 2,
    })
      .removeKeyboard(true)
      .oneTime()
      .extra());
});


module.exports = reports;

const { Markup } = require('telegraf');
const { BeachCam } = require('../scrapper/BeachCam');


const { REPORTS, beaches } = require('../constants');

const { areas } = beaches.beaches;


const openSlopesHandler = (resort, reply) => {
  switch (resort.caption) {
    default:
      return BeachCam(resort, reply);
  }
};

const replySpot = (app, resort) => {
  app.action(resort.caption, async ({ editMessageText, reply }) => {
    editMessageText('Loading ...',
      await openSlopesHandler(resort, reply));
  });
};

const replyArea = (app, { caption, spots }) => {
  spots.forEach((spot) => replySpot(app, spot));
  const replies = spots.map((spot) => Markup.callbackButton(spot.caption,
    spot.caption));
  app.action(caption, ({ reply }) => reply('Choose a spot:',
    Markup.inlineKeyboard(replies, {
      columns: 2,
    })
      .removeKeyboard(true)
      .oneTime()
      .extra()));
};

const reports = (app) => app.command(REPORTS, ({ reply }) => {
  areas.forEach((spot) => replyArea(app, spot));

  const replies = areas.map((area) => Markup.callbackButton(area.caption,
    area.caption));

  return reply('Choose an Area:',
    Markup.inlineKeyboard(replies, {
      columns: 2,
    })
      .removeKeyboard(true)
      .oneTime()
      .extra());
});

module.exports = reports;

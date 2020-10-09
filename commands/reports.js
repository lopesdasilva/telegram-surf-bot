const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { Markup } = require('telegraf');


const { REPORTS, spots } = require('../constants');

const reportBeachCam = (resort, reply) => {
  const {
    url,
  } = resort.reports;

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html);


      const seaTemperature = $('.suits .water span').text();
      const suitRecommendation = $('.infoSuit p').text();

      const waveheight = $('.weatherReport__content__item__info__text')[1].children[0].data.trim();
      const wavePeriod = $('.weatherReport__content__item__info__text')[2].children[0].data.trim();
      const waveDirection = $('.weatherReport__content__item__info__text')[3].children[0].data.trim();

      const windDirection = $('.weatherReport__content__item__info__text')[4].children[0].data.trim();
      const windSpeed = $('.weatherReport__content__item__info__text')[5].children[0].data.trim();

      const weather = $('.weatherReport__content__item__info__text')[6].children[0].data.trim();
      const weatherTemperature = $('.weatherReport__content__item__info__text')[7].children[0].data.trim();
      const weatherUV = $('.weatherReport__content__item__info__text')[8].children[0].data.trim();

      const lastUpdateFormatted = $('.weatherReport__header__title').text();

      reply(`*Surf report state - ${resort.caption}*

*🌡️Water temperature:* ${seaTemperature}
*🏄Suit recommendation:* ${suitRecommendation}

*🌊SEA*
*Sea temperature:* ${seaTemperature}
*Wave height:* ${waveheight}m
*Wave period:* ${wavePeriod}
*Wave directions:* ${waveDirection}

*🌬WIND*
*Wind direction:* ${windDirection}
*Wind speed:* ${windSpeed}

*🏖️BEACH*
*Weather:* ${weather}
*Weather Temperature:* ${weatherTemperature}
*UV:* ${weatherUV}

${lastUpdateFormatted}

*Stream:* ${resort.stream}
`,
      { parse_mode: 'Markdown' });
    });
};

const openSlopesHandler = (resort, reply) => {
  switch (resort.caption) {
    default:
      return reportBeachCam(resort, reply);
  }
};

const replyOpenSlopes = (app, resort) => {
  app.action(resort.caption, async ({ editMessageText, reply }) => {
    editMessageText('Loading ...',
      await openSlopesHandler(resort, reply));
  });
};

const reports = (app) => app.command(REPORTS, ({ reply }) => {
  replyOpenSlopes(app, spots.cabanadopescador);
  replyOpenSlopes(app, spots.saojoao);
  replyOpenSlopes(app, spots.barbascds);
  replyOpenSlopes(app, spots.marcelinocds);
  replyOpenSlopes(app, spots.praianova);
  replyOpenSlopes(app, spots.riviera);
  replyOpenSlopes(app, spots.fontedatelha);

  return reply('Choose a spot:',
    Markup.inlineKeyboard([
      Markup.callbackButton(spots.cabanadopescador.caption,
        spots.cabanadopescador.caption),
      Markup.callbackButton(spots.saojoao.caption, spots.saojoao.caption),
      Markup.callbackButton(spots.barbascds.caption, spots.barbascds.caption),
      Markup.callbackButton(spots.marcelinocds.caption, spots.marcelinocds.caption),
      Markup.callbackButton(spots.praianova.caption, spots.praianova.caption),
      Markup.callbackButton(spots.riviera.caption, spots.riviera.caption),
      Markup.callbackButton(spots.fontedatelha.caption, spots.fontedatelha.caption),
    ], {
      columns: 2,
    }).oneTime().extra());
});

module.exports = reports;

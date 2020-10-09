const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { Markup } = require('telegraf');

const { REPORTS, almada } = require('../constants');

const { spots } = almada.almada;

function getDayForecast($, number) {
  const date = $(`#dayweek_${number}_top .date`)[0].children[0].data.trim();
  const weatherTemperature = $(`#dayweek_${number}_top .temperature`)[0].children[0].data.trim();
  const weather = $(`#dayweek_${number}_top .summary`)[0].children[0].data.trim();
  const waveHeight = $(`#dayweek_${number} .values`)[0].children[0].data.trim();
  const wavePeriod = $(`#dayweek_${number} .values`)[3].children[0].data.trim();
  const waveDirection = $(`#dayweek_${number} .values`)[1].children[0].data.trim();
  const windSpeed = $(`#dayweek_${number} .values`)[5].children[0].data.trim();
  const windDirection = $(`#dayweek_${number} .values`)[2].children[0].data.trim();

  const seaTemperature = $(`#dayweek_${number} .values`)[4].children[0].data.trim();

  return `*${date}: ${waveHeight}m* ${wavePeriod}s ${waveDirection} ${weather} ${weatherTemperature}ºC ${windDirection} ${windSpeed}km/h\n`;
}

function getForecast($) {
  const day1 = getDayForecast($, 1);
  const day2 = getDayForecast($, 2);
  const day3 = getDayForecast($, 3);
  const day4 = getDayForecast($, 4);

  return `${day1}${day2}${day3}${day4}`;
}

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

      const forecast = getForecast($);

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

*📅Previsao:* 
${forecast}

${lastUpdateFormatted}

*🎥Stream:* ${resort.stream}
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
  spots.forEach((spot) => replyOpenSlopes(app, spot));

  const replies = spots.map((spot) => Markup.callbackButton(spot.caption,
    spot.caption));

  return reply('Choose a spot:',
    Markup.inlineKeyboard(replies, {
      columns: 2,
    }).oneTime().extra());
});

module.exports = reports;

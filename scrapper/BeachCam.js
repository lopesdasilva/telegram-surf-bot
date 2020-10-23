const fetch = require('node-fetch');
const { load } = require('cheerio');

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

function getEmoji(color) {
  switch (color) {
    case 'green':
      return '🟢';
    case 'red':
      return '🔴';
    case 'yellow':
      return '🟡';
    default:
      return undefined;
  }
}

function getSemaphore(waveheightColor) {
  const replace = 'weatherReport__content__item__info__circle weatherReport__content__item__info__circle--';
  const replace1 = waveheightColor.replace(replace, '');

  return getEmoji(replace1);
}

function getCurrentConditions($) {
  const weatherReportArray = $('.weatherReport__content__item__info__text');
  const weatherReportArraySemaphore = $('.weatherReport__content__item__info__circle');

  const suitRecommendation = $('.infoSuit p')
    .text();

  const seaTemperature = weatherReportArray[0].children[0].data.trim();
  const seaTemperatureEmoji = getSemaphore(weatherReportArraySemaphore[0].attribs.class.trim());

  const waveheight = weatherReportArray[1].children[0].data.trim();
  const waveheightEmoji = getSemaphore(weatherReportArraySemaphore[1].attribs.class.trim());

  const wavePeriod = weatherReportArray[2].children[0].data.trim();
  const wavePeriodEmoji = getSemaphore(weatherReportArraySemaphore[2].attribs.class.trim());

  const waveDirection = weatherReportArray[3].children[0].data.trim();
  const waveDirectionEmoji = getSemaphore(weatherReportArraySemaphore[3].attribs.class.trim());

  const windDirection = weatherReportArray[4].children[0].data.trim();
  const windDirectionEmoji = getSemaphore(weatherReportArraySemaphore[4].attribs.class.trim());

  const windSpeed = weatherReportArray[5].children[0].data.trim();
  const windSpeedEmoji = getSemaphore(weatherReportArraySemaphore[5].attribs.class.trim());

  const weather = weatherReportArray[6].children[0].data.trim();
  const weatherEmoji = getSemaphore(weatherReportArraySemaphore[6].attribs.class.trim());

  const weatherTemperature = weatherReportArray[7].children[0].data.trim();
  const weatherTemperatureEmoji = getSemaphore(weatherReportArraySemaphore[7]
    .attribs.class.trim());

  const weatherUV = weatherReportArray[8].children[0].data.trim();
  const weatherUVEmoji = getSemaphore(weatherReportArraySemaphore[8].attribs.class.trim());


  const lastUpdateFormatted = $('.weatherReport__header__title')
    .text();

  return {
    suitRecommendation,
    seaTemperature,
    seaTemperatureEmoji,
    waveHeight: waveheight,
    waveHeightEmoji: waveheightEmoji,
    wavePeriod,
    wavePeriodEmoji,
    waveDirection,
    waveDirectionEmoji,
    windDirection,
    windDirectionEmoji,
    windSpeed,
    windSpeedEmoji,
    weather,
    weatherEmoji,
    weatherTemperature,
    weatherTemperatureEmoji,
    weatherUV,
    weatherUVEmoji,
    lastUpdateFormatted,
  };
}

function buildMarkup({ spot, current, forecast }) {
  const { caption, stream } = spot;

  const {
    suitRecommendation,
    seaTemperature,
    seaTemperatureEmoji,
    waveHeight,
    waveHeightEmoji,
    wavePeriod,
    wavePeriodEmoji,
    waveDirection,
    waveDirectionEmoji,
    windDirection,
    windDirectionEmoji,
    windSpeed,
    windSpeedEmoji,
    weather,
    weatherEmoji,
    weatherTemperature,
    weatherTemperatureEmoji,
    weatherUV,
    weatherUVEmoji,
    lastUpdateFormatted,
  } = current;

  return `*Surf report state - ${caption}*
            
            *🏄Suit recommendation:* ${suitRecommendation}
            
            *🌊SEA*
            *Sea temperature:* ${seaTemperature}ºC ${seaTemperatureEmoji}
            *Wave height:* ${waveHeight}m ${waveHeightEmoji}
            *Wave period:* ${wavePeriod} ${wavePeriodEmoji}
            *Wave directions:* ${waveDirection} ${waveDirectionEmoji}
            
            *🌬WIND*
            *Wind direction:* ${windDirection} ${windDirectionEmoji}
            *Wind speed:* ${windSpeed}km/h ${windSpeedEmoji}
            
            *🏖️BEACH*
            *Weather:* ${weather} ${weatherEmoji}
            *Weather Temperature:* ${weatherTemperature}ºC ${weatherTemperatureEmoji}
            *UV:* ${weatherUV} ${weatherUVEmoji}
            
            *📅Forecast:* 
            ${forecast}
            
            ${lastUpdateFormatted}
            
            *🎥Stream:* ${stream}
            `;
}

function scrapeAndGetMarkup(spot) {
  const {
    url,
  } = spot.reports;

  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const $ = load(html);

      return { spot, forecast: getForecast($), current: getCurrentConditions($) };
    });
}

exports.BeachCam = async (resort, reply) => {
  const weather = await scrapeAndGetMarkup(resort);
  const replyMarkup = buildMarkup(weather);
  await reply(replyMarkup,
    { parse_mode: 'Markdown' });
};

exports.scrapeAndGetMarkup = scrapeAndGetMarkup;

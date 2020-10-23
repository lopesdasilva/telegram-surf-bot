const { scrapeAndGetMarkup } = require('../../scrapper/BeachCam');
const { beaches } = require('../../constants/spots');

let weather;
describe('BeachCam Scrapping', () => {
  beforeAll(async () => {
    weather = await scrapeAndGetMarkup(beaches.areas[0].spots[0]);
  });


  test('Suit recommendation is ok', async () => {
    const { suitRecommendation } = weather.current;
    await expect(suitRecommendation)
      .toMatch(RegExp('\\d\\/\\dmm'));
  });

  test('Sea temperature is ok', async () => {
    const { seaTemperature } = weather.current;
    await expect(seaTemperature)
      .toMatch(RegExp('\\d{1,2},?\\d?'));
  });
});

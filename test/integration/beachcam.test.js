import { getFullList, getIMPAReportRequest } from '../../modules/reports/api/BeachCam';

let livecams;
describe('BeachCam API', () => {
  beforeAll(async () => {
    const { Livecams } = await getFullList();
    livecams = Livecams;
  });

  test('Title is ok', async () => {
    expect(livecams[0].Title)
      .toMatch(/.+/);
  });

  test('Sea temperature is ok', async () => {
    const { WaterTemperature = '' } = await getIMPAReportRequest(livecams[0].Id);
    expect(String(WaterTemperature))
      .toMatch(/\d\.?\d?/);
  });

  test('Wave Height is ok', async () => {
    const { WaveHeight = '' } = await getIMPAReportRequest(livecams[0].Id);
    expect(String(WaveHeight))
      .toMatch(/\d{1,2},?\d?/);
  });
});

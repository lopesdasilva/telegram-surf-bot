import { expect, jest, test } from '@jest/globals';
import { opensource } from '../../modules/opensource/opensource.js';

const bot = {
  command: jest.fn(),
};

test('Replies with the repository message', () => {
  opensource(bot);

  expect(bot.command).toHaveBeenCalled();
});

import { command, repoUrl } from './constants.js';

export const opensource = (app) => app.command(command, (ctx) => ctx.reply(repoUrl));
export default { opensource };

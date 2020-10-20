const { OPENSOURCE, opensource: githubUrl } = require('../constants');

const opensource = (app) => app.command(OPENSOURCE, ({ reply }) => reply(`If you feel like improving me, just follow ${githubUrl}.`));

module.exports = opensource;

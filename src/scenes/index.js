const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    ...require('./start'),
    ...require('./admin'),
    ...require('./order'),
]);

module.exports = stage;
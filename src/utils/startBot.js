const config = require('./config');

const startBot = (bot, botConfig = {}) => {
    if (config.NODE_ENV === 'production') {
        botConfig.webhook = {
            domain: config.DOMAIN,
            port: config.PORT
        };
    }
    bot.launch(botConfig)
    console.log("===== Bot ishga tushdi =====")    
};

module.exports = startBot;
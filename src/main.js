require('dotenv').config();

const bot = require('./core/bot');
const session = require('./core/session');
const stage = require('./scenes');
const connectDB = require('./utils/connectDB');
const startBot = require('./utils/startBot');
const auth = require('./middleware/auth')
const isAdmin = require('./middleware/isAdmin')

const mediaGroup = require("telegraf-media-group")

connectDB()

bot.use(session);
bot.use((ctx, next) => {
    if (!ctx.session) {
        ctx.session = {}
    }
    next()
})
bot.use(mediaGroup())
bot.use(auth)
bot.use(stage.middleware())

bot.command("admin", isAdmin, (ctx) => ctx.scene.enter("admin"))

bot.start(ctx => ctx.scene.enter('start'));

startBot(bot);

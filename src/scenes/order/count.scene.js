const { Scenes, Markup } = require("telegraf")

const scene = new Scenes.BaseScene("order:count")

scene.enter((ctx) => {
    let keyboard = Markup.keyboard([["❌ Bekor qilish"]]).resize()
    ctx.reply("Maxsulot sonini kiriting:", keyboard)
})

scene.command("/start", (ctx) => ctx.scene.enter("start"))
scene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("start"))

scene.on("text", async (ctx) => {
    try {
        const count = parseInt(ctx.message.text)

        if (isNaN(count)) {
            return ctx.reply("Iltimos, maxsulot sonini raqamda kiriting")
        }

        if (count < 1) {
            return ctx.reply("Iltimos, maxsulot sonini 1 dan katta son kiriting")
        }
        
        ctx.session.product.count = count

        ctx.scene.enter("order:confirm")
    } catch (error) {
        console.log(error)
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})

module.exports = scene

const { Scenes, Markup } = require("telegraf")

const scene = new Scenes.BaseScene("order:color")

scene.enter((ctx) => {
    ctx.reply("Maxsulot rangini kiriting:")
})

scene.command("/start", (ctx) => ctx.scene.enter("start"))
scene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("start"))

scene.on("text", async (ctx) => {
    try {
        // Rangni sessionda saqlash
        ctx.session.product.color = ctx.message.text

        ctx.scene.enter("order:phone")
    } catch (error) {
        console.log(error)
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})

module.exports = scene

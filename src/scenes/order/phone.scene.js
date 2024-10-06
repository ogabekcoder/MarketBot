const { Scenes, Markup } = require("telegraf")

const scene = new Scenes.BaseScene("order:phone")

scene.enter((ctx) => {
    ctx.reply("Telefon raqamingizni kiriting:")
})

scene.command("/start", (ctx) => ctx.scene.enter("start"))
scene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("start"))

scene.on("text", async (ctx) => {
    try {
        // O'lchamni sessionda saqlash
        ctx.session.product.phone = ctx.message.text

        ctx.scene.enter("order:address") 
    } catch (error) {
        console.log(error)
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})

module.exports = scene

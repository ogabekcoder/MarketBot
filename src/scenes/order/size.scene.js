const { Scenes, Markup } = require("telegraf")

const scene = new Scenes.BaseScene("order:size")

scene.enter((ctx) => {
    let keyboard = Markup.keyboard([["❌ Bekor qilish"]]).resize()
    ctx.reply("Maxsulot o'lchamini kiriting:", keyboard)
})

scene.command("/start", (ctx) => ctx.scene.enter("start"))
scene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("start"))

scene.on("text", async (ctx) => {
    try {
        // O'lchamni sessionda saqlash
        ctx.session.product.size = ctx.message.text

        // Rang sahnasiga o'tish
        ctx.scene.enter("order:color") // Rang sahnasiga kirish
    } catch (error) {
        console.log(error)
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})

module.exports = scene

const { Scenes, Markup } = require("telegraf")

const scene = new Scenes.BaseScene("order:address")

scene.enter((ctx) => {
    ctx.reply("Manzilingizni kiriting:")
})

scene.command("/start", (ctx) => ctx.scene.enter("start"))
scene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("start"))

scene.on("text", async (ctx) => {
    try {
        // Manzilni sessionda saqlash
        ctx.session.product.address = ctx.message.text

        // Location sahnasiga o'tish
        ctx.scene.enter("order:location")
    } catch (error) {
        console.log(error)
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})

module.exports = scene

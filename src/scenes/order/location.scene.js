const { Scenes, Markup } = require("telegraf")

const scene = new Scenes.BaseScene("order:location")

scene.enter((ctx) => {
    // Joylashuvni yuborish tugmasini yaratish
    let keyboard = Markup.keyboard([
        [Markup.button.locationRequest("📍 Joylashuvni yuborish")], // Lokatsiya yuborish tugmasi
        ["❌ Bekor qilish"], // Bekor qilish tugmasi
    ]).resize()

    ctx.reply("Joylashuvingizni '📍 Joylashuvni yuborish' tugmasini bosib yuboring", keyboard)
})

scene.command("/start", (ctx) => ctx.scene.enter("start"))
scene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("start"))

scene.on("location", async (ctx) => {
    try {
        // Lokatsiyani sessionda saqlash
        ctx.session.product.location = {
            latitude: ctx.message.location.latitude,
            longitude: ctx.message.location.longitude,
        }

        ctx.scene.enter("order:count")
    } catch (error) {
        console.log(error)
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})

module.exports = scene

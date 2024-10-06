const { Scenes, Markup } = require("telegraf")
const ProductModel = require("../../Models/product.model")

const scene = new Scenes.BaseScene("admin:product:delete")

scene.enter(async (ctx) => {
    let keyboard = Markup.keyboard([["❌ Bekor qilish"]]).resize()

    await ctx.reply("O'chirish uchun maxsulot ID sini yuboring", keyboard)
})

scene.command("start", (ctx) => ctx.scene.enter("start"))
scene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("admin"))

scene.on("text", async (ctx) => {
    const productID = parseFloat(ctx.message.text)

    if (isNaN(productID)) {
        return ctx.reply("Iltimos, maxsulot ID'sini raqamda kiriting:")
    }

    try {
        await ProductModel.updateOne(
            { productID },
            {
                $set: {
                    status: "deleted",
                },
            }
        )

        await ctx.reply(
            `Maxsulot muvaffaqiyatli o'chirildi!`
        )

        await ctx.scene.enter("admin")
    } catch (error) {
        await ctx.reply("Ma'lumotlarni o'chirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
        console.error("Ma'lumotlarni o'chirishda xatolik:", error)
    }
})

module.exports = scene

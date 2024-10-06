const { Scenes, Markup } = require("telegraf")
const isAdmin = require("../../middleware/isAdmin")
const ProductModel = require("../../Models/product.model")

const scene = new Scenes.BaseScene("start")

scene.enter(async (ctx) => {
    try {
        const firstName = ctx.from.first_name || "" // Foydalanuvchi ismi (agar mavjud bo'lsa)
        const lastName = ctx.from.last_name || "" // Foydalanuvchi familiyasi (agar mavjud bo'lsa)
        const fullName = `${firstName} ${lastName}`.trim() // To'liq ism, faqat mavjud qismlar

        const userId = ctx.from.id // Foydalanuvchi ID'si

        const message = `👋 Assalomu alaykum, [${fullName}](tg://user?id=${userId})! Botga xush kelibsiz!\n\n📦 Iltimos, maxsulot IDsini kiriting:`

        // Tugmalarni bo'sh qilib yuborish
        await ctx.reply(message, {
            parse_mode: "Markdown",
            reply_markup: { remove_keyboard: true },
        }) // Bo'sh tugmalar
    } catch (error) {
        console.log(error)
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})

scene.command("start", (ctx) => ctx.scene.enter("start"))
scene.command("admin", isAdmin, (ctx) => ctx.scene.enter("admin"))

scene.on("text", async (ctx) => {
    try {
        const productID = parseInt(ctx.message.text)

        if (isNaN(productID)) {
            return ctx.reply("Iltimos, to'g'ri maxsulot ID'sini kiriting:")
        }

        // Maxsulotni izlash
        const product = await ProductModel.findOne({ productID, status: "active" })

        if (!product) {
            return ctx.reply("Maxsulot topilmadi. Iltimos, qayta urinib ko'ring:")
        }

        // Rasmlar mavjudligini tekshirish
        if (!product.images || product.images.length === 0) {
            return ctx.reply("Maxsulot uchun rasm topilmadi.")
        }

        // Rasmlar media gruppaga o'tkazish
        const mediaGroup = product.images.map((imageUrl, index) => {
            return {
                type: "photo",
                media: imageUrl,
                caption:
                    index === 0
                        ? `${product.text}\n💳Narxi: ${product.price} so'm\n\n🔹ID: ${product.productID}`
                        : undefined, // Faqat birinchi rasmda caption bo'ladi
            }
        })

        // Media gruppani jo'natish
        await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup)

        // Buyurtma qilish uchun tugma
        const extra = Markup.inlineKeyboard([
            Markup.button.callback("🛒 Buyurtma qilish", `order_product#${productID}`),
        ])

        // Tugmani alohida jo'natish
        await ctx.reply("Quyidagi tugma orqali buyurtma qilishingiz mumkin:", extra)
    } catch (error) {
        console.log(error)
        await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})


// "Buyurtma qilish" tugmasini qayta ishlash
scene.action(/order_product#(.+)/, (ctx) => {
    const productID = ctx.match[1]
    ctx.answerCbQuery()

    // Buyurtma qilish uchun buyurtma ma'lumotlarini sessionda saqlash
    ctx.session.product = {}
    ctx.session.product.productID = productID

    ctx.scene.enter("order:size")
})

module.exports = scene

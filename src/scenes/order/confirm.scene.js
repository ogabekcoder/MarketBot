const { Scenes, Markup } = require("telegraf")
const OrderModel = require("../../Models/order.model")
const ProductModel = require("../../Models/product.model")
const UserModel = require("../../Models/user.model")

const scene = new Scenes.BaseScene("order:confirm")

scene.enter(async (ctx) => {
    const product = await ProductModel.findOne({ productID: ctx.session.product.productID })

    // Yakuniy buyurtma ma'lumotlarini yig'ish
    const total = product.price * ctx.session.product.count

    const orderDetails = `
📦 Buyurtma ma'lumotlari:
📎 ID: ${ctx.session.product.productID}
📌 Mahsulot: ${product.text}
📏 O'lcham: ${ctx.session.product.size}
🎨 Rang: ${ctx.session.product.color}
☎️ Telefon: ${ctx.session.product.phone} 
🏠 Yetkazish manzili: ${ctx.session.product.address}
📍 Lokatsiya: Lat: ${ctx.session.product.location.latitude}, Long: ${ctx.session.product.location.longitude}
🛒 Soni: ${ctx.session.product.count} ta
💰 Narxi: ${product.price} so'm
🔢 Umumiy narx: ${total} so'm
        `

    // Buyurtmani foydalanuvchiga tasdiqlash uchun yuborish
    await ctx.replyWithPhoto(product.images[0], {
        caption: orderDetails,
        ...Markup.keyboard([["✅ Tasdiqlash"], ["❌ Bekor qilish"]]).resize(),
    })
})

// Tasdiqlash va buyurtmani saqlash
scene.hears("✅ Tasdiqlash", async (ctx) => {
    try {
        const user = await UserModel.findOne({ userID: ctx.from.id })
        const product = await ProductModel.findOne({ productID: ctx.session.product.productID })

        const orderData = {
            userID: user._id,
            productID: product._id,
            phone: ctx.session.product.phone,
            size: ctx.session.product.size,
            color: ctx.session.product.color,
            count: ctx.session.product.count,
            address: ctx.session.product.address,
            location: ctx.session.product.location,
        }

        const order = new OrderModel(orderData)
        await order.save()

        const total = product.price * ctx.session.product.count

        const orderDetails = `
📦 Yangi buyurtma:
📎 ID: ${ctx.session.product.productID}
📌 Mahsulot: ${product.text}
📏 O'lcham: ${ctx.session.product.size}
🎨 Rang: ${ctx.session.product.color}
☎️ Telefon: ${ctx.session.product.phone} 
🏠 Yetkazish manzili: ${ctx.session.product.address}
📍 Lokatsiya: Lat: ${ctx.session.product.location.latitude}, Long: ${ctx.session.product.location.longitude}
🛒 Soni: ${ctx.session.product.count} ta
💰 Narxi: ${product.price} so'm
🔢 Umumiy narx: ${total} so'm
        `

        const admins = process.env.ADMINS.split(",").filter((id) => id.trim() !== "")

        for (let adminID of admins) {
            try {
                await ctx.telegram.sendPhoto(adminID, product.images[0], {
                    caption: orderDetails,
                })
            } catch (error) {
                console.log("Xabar yuborishda xatolik:", error)
            }
        }

        await ctx.reply("Buyurtmangiz muvaffaqiyatli tasdiqlandi")

        // Sessionni tozalash
        ctx.session.product = null

        // Sahnadan chiqish yoki bosh sahnaga o'tish
        ctx.scene.enter("start")
    } catch (error) {
        console.log("Buyurtmani saqlashda xatolik:", error)
        await ctx.reply("Buyurtmani saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
})

// Bekor qilish
scene.hears("❌ Bekor qilish", (ctx) => {
    ctx.reply("Buyurtma bekor qilindi.")
    ctx.scene.enter("start")
})

module.exports = scene

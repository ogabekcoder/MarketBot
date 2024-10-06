const { Scenes, Markup } = require("telegraf")
const { writeToSheet } = require("../../utils/sheets")
const ProductModel = require("../../Models/product.model")
const OrderModel = require("../../Models/order.model")

const adminScene = new Scenes.BaseScene("admin")

adminScene.enter(async (ctx) => {
    let keyboard = Markup.keyboard([
        ["➕ Maxsulot qo'shish", "🗒 Maxsulotlar"],
        ["📡 Buyurtmalar", "🗑 O'chirish"],
        ["◀️ Paneldan chiqish"],
    ]).resize()

    await ctx.reply("👑 Admin paneli", keyboard)
})

adminScene.command("start", (ctx) => ctx.scene.enter("start"))
adminScene.hears("◀️ Paneldan chiqish", (ctx) => ctx.scene.enter("start"))

adminScene.hears("➕ Maxsulot qo'shish", (ctx) => ctx.scene.enter("admin:product:new"))

adminScene.hears("🗒 Maxsulotlar", async (ctx) => {
    try {
        // Mahsulotlarni olish
        let products = await ProductModel.find()

        // Ustun nomlarini qo'shish
        const header = ["ID", "Ma'lumoti", "Narxi", "Rasmi", "Vaqti", "Holati"]

        // Mahsulotlarni Google Sheets formatida tayyorlash
        const values = products.map((product) => [
            product.productID, // Mahsulot ID
            product.text, // Mahsulot nomi
            product.price, // Mahsulot narxi
            product.images.join(", "), // Mahsulot rasmlari (agar bir nechta bo'lsa, ulanishi)
            new Date(product.createdAt).toLocaleDateString(), // Yaralgan sana
            product.status === "active" ? "Faol" : "O'chirilgan",
        ])

        // Ustun nomlarini va mahsulotlarni birlashtirish
        const allValues = [header, ...values]

        // Google Sheets'ga yozish
        await writeToSheet(allValues)

        // Foydalanuvchiga xabar yuborish
        await ctx.reply(
            "Maxsulotlar ro'yxati:\nhttps://docs.google.com/spreadsheets/d/1cIfeyA26tUt48NyAO8f46CHzOvkJNi--nys28pEx-EQ/edit?gid=0#gid=0"
        )
    } catch (error) {
        console.error("Error fetching products:", error)
        await ctx.reply("Mahsulotlarni olishda xatolik yuz berdi.")
    }
})

adminScene.hears("📡 Buyurtmalar", async (ctx) => {
    try {
        // Buyurtmalarni olish
        let orders = await OrderModel.find().populate("productID")
        console.log(orders)
           
        // Ustun nomlarini qo'shish
        const header = [
            "ID",
            "Mahsulot",
            "O'lchami",
            "Rangi",
            "Manzil",
            "Lokatsiya",
            "Soni",
            "Umumiy Narxi",
            "Telefon raqami",      
            "Yaralgan sana",               
        ]    

        // Buyurtmalarni Google Sheets formatida tayyorlash
        const values = orders.map((order) => [
            order.productID.productID, // Buyurtma ID
            order.productID.text, // Mahsulot ma'lumoti
            order.size, // O'lcham
            order.color, // Rang
            order.address, // Manzil
            `(${order.location.latitude}, ${order.location.longitude})`, // Lokatsiya (kenglik va uzunlik)
            order.count, // Mahsulot soni
            order.total, // Umumiy narx
            order.phone_number, // Telefon raqami
            new Date(order.createdAt).toLocaleDateString(), // Yaralgan sana
        ])

        // Ustun nomlarini va buyurtmalarni birlashtirish
        const allValues = [header, ...values]

        // Google Sheets'ga yozish
        await writeToSheet(allValues)

        // Foydalanuvchiga xabar yuborish
        await ctx.reply(
            "Buyurtmalar ro'yxati:\nhttps://docs.google.com/spreadsheets/d/1cIfeyA26tUt48NyAO8f46CHzOvkJNi--nys28pEx-EQ/edit?gid=0#gid=0"
        )
    } catch (error) {
        console.error("Error fetching orders:", error)
        await ctx.reply("Buyurtmalarni olishda xatolik yuz berdi.")
    }
})

adminScene.hears("🗑 O'chirish", (ctx) => ctx.scene.enter("admin:product:delete"))

module.exports = adminScene

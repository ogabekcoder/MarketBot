const { Scenes, Markup } = require("telegraf")
// const { writeToSheet } = require("../sheets")
const cloudinary = require("cloudinary").v2
const ProductModel = require("../../Models/product.model")

cloudinary.config({
    cloud_name: "drqsvaf78",
    api_key: "672144297336588",
    api_secret: "m0V60scNyETn7x1Lm7NhykTIpCY",
})

const productNewScene = new Scenes.BaseScene("admin:product:new")

// Sahnaga kirish
productNewScene.enter(async (ctx) => {
    let keyboard = Markup.keyboard([["❌ Bekor qilish"]]).resize()

    await ctx.reply("Maxsulot postini to'liq yuboring (rasm va matn bilan)", keyboard)
})

productNewScene.command("start", (ctx) => ctx.scene.enter("start"))
productNewScene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("admin"))

// Bitta rasm yoki media gruppa qabul qilish
productNewScene.on(["photo", "media_group"], async (ctx) => {
    try {
        let photoUrls = [];
        let caption = "";

        // Agar media group xabar bo'lsa
        const messages = ctx.mediaGroup || [ctx.message];

        for (const message of messages) {
            if (message.photo) {
                // Rasmlarni qayta ishlash
                const largestPhoto = message.photo[message.photo.length - 1]; // Eng katta rasmni olish
                const photoUrl = await ctx.telegram.getFileLink(largestPhoto.file_id);

                // Cloudinary'ga yuklash
                const uploadResult = await cloudinary.uploader.upload(photoUrl.href, {
                    folder: "bekor",
                    transformation: [
                        { width: 800, height: 800, crop: "limit", quality: "100" }, // Sifatni 100 ga o'rnatish (eng yuqori sifat)
                    ],
                    public_id: `bekor/${Date.now()}`,
                });

                // Yuklangan rasm URLini saqlaymiz
                photoUrls.push(uploadResult.secure_url);

                // Agar caption mavjud bo'lsa, uni olish
                if (message.caption) {
                    caption = message.caption;
                }
            }
        }

        // Contextga rasm va matnni qo'shish
        ctx.session.product = {
            text: caption || "Matn yo'q", // Matnni title sifatida qabul qilish
            images: photoUrls, // Yuklangan barcha rasm URL'larini saqlash
        };

        // Narx sahnasiga o'tish
        ctx.scene.enter("admin:product:new:price");
    } catch (error) {
        await ctx.reply(
            "Rasmlarni yuklash yoki ma'lumotlarni saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
        );
        console.error("Rasmlarni yuklashda yoki ma'lumotlarni saqlashda xatolik:", error);
    }
}); 

// ===== Narxni qabul qilish sahnasi =====
const productPriceScene = new Scenes.BaseScene("admin:product:new:price")

productPriceScene.enter(async (ctx) => {
    let keyboard = Markup.keyboard([["❌ Bekor qilish"]]).resize()
    await ctx.reply("Maxsulot narxini kiriting (son shaklida):", keyboard)
})   
 
productPriceScene.command("start", (ctx) => ctx.scene.enter("start"))
productPriceScene.hears("❌ Bekor qilish", (ctx) => ctx.scene.enter("admin"))

productPriceScene.on("text", async (ctx) => {
    const price = parseFloat(ctx.message.text)

    if (isNaN(price)) {
        return ctx.reply("Iltimos, to'g'ri narxni son shaklida kiriting:")
    }

    try {
        const product = new ProductModel(ctx.session.product)
        product.price = price

        const savedProduct = await product.save()

        await ctx.reply(
            `Maxsulot muvaffaqiyatli qo'shildi!\nID: ${savedProduct.productID}\nNarxi: ${savedProduct.price}$`
        )

        // Formani tozalash
        delete ctx.session.product

        // Sahnani yakunlash va admin sahnasiga qaytish
        await ctx.scene.enter("admin")
    } catch (error) {
        await ctx.reply("Ma'lumotlarni saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
        console.error("Ma'lumotlarni saqlashda xatolik:", error)
    }
})

module.exports = [productNewScene, productPriceScene]

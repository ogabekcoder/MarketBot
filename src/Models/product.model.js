const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const ProductSchema = new mongoose.Schema(
    {
        productID: { type: Number, unique: true }, // Auto increment
        text: { type: String }, // Rasmlar uchun sarlavha
        images: [{ type: String }], // Rasm URL yoki fayl yo'li
        price: { type: Number }, // Mahsulot narxi
        status: { type: String, default: "active" },
    },
    { timestamps: true }
)

// Auto-increment uchun maydonni qo'shamiz
ProductSchema.plugin(AutoIncrement, { inc_field: "productID" })

module.exports = mongoose.model("Product", ProductSchema)

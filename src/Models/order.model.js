const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        size: { type: String },
        color: { type: String },
        address: { type: String },
        location: {
            longitude: { type: String },
            latitude: { type: String },
        },
        count: { type: Number },
        total: { type: Number },
        phone_number: { type: String },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)

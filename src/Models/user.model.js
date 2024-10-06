const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        userID: { type: String },
        full_name: { type: String },
        phone_number: { type: String },
        tg_info: { type: Object },
    },
    { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)

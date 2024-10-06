const { default: mongoose } = require("mongoose")

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected")
    } catch (error) {
        console.log("MongoDB connection failed")
        console.log(error)
    }
}

module.exports = connectDB
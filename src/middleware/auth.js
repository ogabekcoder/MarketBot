const UserModel = require("../Models/user.model")

module.exports = async (ctx, next) => {
    try {
        let user = await UserModel.findOne({ userID: ctx.from.id })
        if (!user) {
            user = new UserModel({ userID: ctx.from.id, tg_info: ctx.from })
            await user.save()
        }
        ctx.session.user = user
        return next()
    } catch (error) {
        console.log(error)
    }
}

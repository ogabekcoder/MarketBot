module.exports = (ctx, next) => {
    const admins = process.env.ADMINS.split(",")

    if (admins.some((admin) => admin == ctx.from.id)) {
        return next()
    }
    return
}

const { model, Schema } = require('moongoose')


const UserShema = new Schema ({
    name: String,
    lastName: String,
    email: String,
    password: String,
    balance: Number,
})

UserShema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    }
})

const User = model("User", UserShema) 

module.exports = User
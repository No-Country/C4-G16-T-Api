const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  name: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false },
  passwordHash: { type: String, required: false },
  date: { type: Date, default: Date.now },
  balance: { type: Number, default: 50000 }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User

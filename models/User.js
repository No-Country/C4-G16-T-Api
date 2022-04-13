const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  name: String,
  lastName: String,
  email: String,
  passwordHash: String,
  date: { type: Date, default: Date.now },
  balance: { type: Number, default: 50000 },
  movements: [{
    type: Schema.Types.ObjectId,
    ref: 'Movement'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

const User = model('User', userSchema)

module.exports = User

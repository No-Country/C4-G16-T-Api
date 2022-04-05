const { model, Schema } = require('mongoose')
const bcrypt = require('bcryptjs')

const saltRounds = 10

const UserSchema = new Schema({
  name: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false },
  password: { type: String, required: false },
  date: { type: Date, default: Date.now },
  balance: { type: Number, default: 0 }
})

UserSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    const document = this

    bcrypt.hash(document.password, saltRounds, function (err, hashedPassword) {
      if (err) {
        next(err)
      } else {
        document.password = hashedPassword
        next()
      }
    })
  } else {
    next()
  }
})

UserSchema.methods.isCorrectPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, same) {
    if (err) {
      callback(err)
    } else {
      callback(err, same)
    }
  })
}

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = model('User', UserSchema)

module.exports = User

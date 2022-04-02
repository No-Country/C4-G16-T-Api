const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')


const saltRounds = 10;

const UserSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  // balance: { type: Number, default: 0 }
})

UserSchema.pre('save', function (next) {
  if(this.isNew || this.isModified('password')) {
    const document = this;

    bcrypt.hash(document.password, saltRounds, function (err, hashedPassword) {
      if(err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    })
}else{
  next();
}
})

UserSchema.methods.isCorretPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, same) {
    if(err) {
      callback(err);
    } else {
      callback(err, same);
    }
  })
}


UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('User', UserSchema)

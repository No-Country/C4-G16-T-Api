const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const movementSchema = new Schema({
  amount: { type: Number },
  description: { type: String, required: false },
  date: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

movementSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

movementSchema.plugin(uniqueValidator)

const Movement = model('Movement', movementSchema)

module.exports = Movement

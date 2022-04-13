const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const movementSchema = new Schema({
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

movementSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    returnedObject.date = returnedObject.date.toLocaleString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

movementSchema.plugin(uniqueValidator)

const Movement = model('Movement', movementSchema)

module.exports = Movement

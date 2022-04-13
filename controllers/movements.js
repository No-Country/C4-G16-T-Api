const movementsRouter = require('express').Router()
const User = require('../models/User')
const Movement = require('../models/Movement')

movementsRouter.get('/', async (req, res) => {
  const movements = await Movement.find({}).populate('user', {
    email: 1,
    name: 1,
    lastName: 1
  })
  res.json(movements)
})

movementsRouter.post('/', async (req, res) => {
  const { amount, description, userId } = req.body

  console.log(userId)

  const user = await User.findById(userId)

  const newMovement = new Movement({
    amount,
    description,
    date: new Date(),
    user: user._id
  })
  try {
    const savedMovement = await newMovement.save()
    user.movements = user.movements.concat(savedMovement._id)
    if (user.balance > 0) {
      user.balance = user.balance - savedMovement.amount
    }
    await user.save()

    res.status(201).json(savedMovement)
  } catch (error) {
    console.error(error)
  }
})

module.exports = movementsRouter

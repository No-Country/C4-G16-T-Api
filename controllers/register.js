const registerRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

registerRouter.post('/', async (req, res) => {
  const { name, lastName, email, password } = req.body

  const saltRounds = 10

  try {
    const user = await User.findOne({ email })
    if ((user)) {
      return res.status(401).json({
        error: 'user already exists'
      })
    }

    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({ name, lastName, email, passwordHash })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    console.log(error)
  }
})

module.exports = registerRouter

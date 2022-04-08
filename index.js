require('dotenv').config()
require('./mongo')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const port = process.env.PORT || 8001
const User = require('./models/User')

const app = express()

app.use(cors())
app.use(morgan())
app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).send('server ready')
})

app.get('/users', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

app.get('/users/:id', (req, res, next) => {
  const { id } = req.params

  User.findById(id)
    .then(user => {
      if (user) {
        res.send(user)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

// Creo un usuario
app.post('/register', async (req, res) => {
  const { email, password } = req.body

  const saltRounds = 10

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({ email, passwordHash })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    console.log(error)
  }
})

// autentico el usuario
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid user or password'
    })
  }

  const userForToken = {
    email: user.email
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    {
      expiresIn: 60 * 60 * 24 * 7
    }
  )

  res.send({
    token
  })
})

app.listen(port, () => {
  console.warn(`The server is listening on port ${port}`)
})

require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const port = process.env.PORT || 8001
const User = require('./models/User')
const router = express.Router()

const app = express()

// Here connect to DB
app.use(cors())
app.use(morgan())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('server ready')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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
app.post('/user/register', async (req, res) => {
  const { email, password } = req.body
  const newUser = new User({ email, password })

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    console.log(error)
  }
})

// autentico el usuario
router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).send('ERROR AL AUTENTICAR')
    } else if (!user) {
      res.status(500).send('EL USUARIO NO EXISTE')
    } else {
      user.isCorrectPassword(password, (err, result) => {
        if (err) {
          res.status(500).send('ERROR AL AUTENTICAR')
        } else if (result) {
          res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE')
        } else {
          res.status(500).send('USUARIO Y/0 CONTRASEÑA INCORRECTA')
        }
      })
    }
  })
})

app.listen(port, () => {
  console.warn(`The server is listening on port ${port}`)
})

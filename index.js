require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const port = process.env.PORT || 8001
const loginRouter = require('./controllers/login')
const registerRouter = require('./controllers/register')
const movementsRouter = require('./controllers/movements')
const usersRouter = require('./controllers/users')

const app = express()

app.use(cors())
app.use(morgan())
app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).send('<h1>Banco Digital API</h1>')
})

app.use('/users', usersRouter)

app.use('/movements', movementsRouter)

// Creo un usuario
app.use('/register', registerRouter)

// autentico el usuario
app.use('/login', loginRouter)

app.listen(port, () => {
  console.warn(`The server is listening on port ${port}`)
})

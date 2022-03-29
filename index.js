require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const port = process.env.PORT || 8001

const app = express()

// Here connect to DB
app.use(cors())
app.use(morgan())
app.use(express.json())
app.use('/', (req, res) => {
  res.status(200).send('server ready')
})

app.listen(port, () => {
  console.warn(`server  on port ${port}`)
})




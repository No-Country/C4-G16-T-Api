const { mongoose } = require('mongoose')

const { MONGO_DB_URI } = process.env

const connectionString = MONGO_DB_URI

// Conexión a MongoDB
mongoose.connect(connectionString)
  .then(() => {
    console.log('database connected')
  })
  .catch((err) => {
    console.error(err)
  })

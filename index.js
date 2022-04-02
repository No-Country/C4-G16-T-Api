require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path');
const port = process.env.PORT || 8001
const User = require('./model/User')




const app = express()

// Here connect to DB
app.use(cors())
app.use(morgan())
app.use(express.json())

// app.use('/', (req, res) => {
//   res.status(200).send('server ready')
// })

// configurar los routers


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const router = express.Router()



// Creo un usuario
router.post('/register', async (req, res) => {
  const {  username, password} = req.body;
  const user = new User({  username, password});

  user.save(err=>{
    if(err){
      res.status(500).send('ERROR AL REGISTRAR')
    }else{
      res.status(200).send('USUARIO REGISTRADO')
    }
  })
  

})

//autentico el usuario
router.post('/authenticate', async (req, res)=>{
  const {username, password} = req.body;

  User.findOne({username}, (err, user)=>{
    if(err){
      res.status(500).send('ERROR AL AUTENTICAR')
    }else if(!user){
      res.status(500).send('EL USUARIO NO EXISTE')
    }else{
        user.isCorretPassword(password, (err, result)=>{
          if(err){
            res.status(500).send('ERROR AL AUTENTICAR')
          }else if(result){
            res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE')
          }else{
            res.status(500).send('USUARIO Y/0 CONTRASEÑA INCORRECTA')
          }
          })
        }
    
  })


})





app.listen(port, () => {
  console.warn(`El servidor esta escuchando en ${port}`)
})

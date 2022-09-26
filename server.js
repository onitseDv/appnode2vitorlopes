require('dotenv').config()

const express = require ('express')
const cors = require('cors')
const path = require ('path')
const app = express ()
const rotasIndex = require ('./Rotas/rotas');


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/app', express.static (path.join (__dirname, '/public')))
app.use(rotasIndex);

let port = process.env.PORT || 3000
app.listen (port, () =>{
    console.log(`Servidor iniciado - http://localhost:${port}/`)
})
const express = require('express');
const dont = require('dotenv');
const cook = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

dont.config({path: './env/.env'}) 

app.use(cook) 

app.use('/', require('./routes/router'))

app.listen(3200, () => {
    console.log("servidor activo en puerto 3200")
}) 
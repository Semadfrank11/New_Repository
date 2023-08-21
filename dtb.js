const mysql = require('mysql');

const conect = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

conect.connect( (error)=> {
    if(error){
        console.log(error)
        return
    }
    console.log('conectado a la base de datos')
})

module.exports = conect 
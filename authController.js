const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const conexion = require('../database/dtb')
const {promisify} = require('util')

exports.register = async (req, res)=> {

try{
   const name = req.body.name
   const user = req.body.user
   const password = req.body.password 
   let passHash = await bcrypt.hash(password, 8)
   
   conexion.query('INSERT INTO usuarios SET ?', 
   {user: user, name: name, password: passHash},
   res.send('exito'), (error, results)=>{
       if(error){console.log(error)}
       res.redirect('/')
   })
}catch (error) {
   console.log(error)
}
}

exports.login = async (req, res)=>{
   try{
       const user = req.body.user
       const password = req.body.password
       
      if(!user || !password){
         res.send('ingrese un usuario y una contraseña');
      }else{
         conexion.query('SELECT*FROM usuarios WHERE user = ?', [user], async(error, results)=>{
            if(results.length==0 ||!(await bcrypt.compare(password, results[0].password)) ){
              res.send('usuario y/o contraseña incorrectos') 
            }else{
               const id = results[0].id
               const token = jwt.sign({id: id}, process.env.JWT_SECRETO, {
                  expiresIn: process.env.JWT_TIEMPO
               })
               console.log("token"+token+"para el usuario"+user)

               const cookiesOpt = {
                  expires: new Date(Date.now()+process.env.JW_COOKIE*24*60*60*1000),
                  httpOnly: true
               } 
               res.cookie('JWT', token, cookiesOpt)
               res.send('Login correcto')
            }
          })
      }
   }catch(error){

   }
}
exports.Authenticated = async (req, res, next)=> {
   if(req.cookiesOpt.jwt){
      try{
         const deco = await promisify(jwt.verify)(req.cookiesOpt.jwt, process.env.JWT_SECRETO)
         conexion.query('SELECT*FROM usuarios WHERE id=?', [deco.id], (error, results) =>{
            if(!results){return next()}
            req.user = results[0]
            return next()
         })
      }catch (error){
         console.log(error)
         return(next)
      }
   }else{
      res.redirect('/login')
      next()
   }
}

exports.logout = (req, res)=>{
   res.clearCookie(jwt)
   return res.redirect('/')
}



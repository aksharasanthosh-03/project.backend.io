 const express = require('express')
 const mongoose = require('mongoose')
 const path = require('path')
 const port = 3019

 const app = express();
 app.use(express.static(__dirname))
 app.use(express.urlencoded({extended :true}))

 mongoose.connect('mongodb://localhost:27017/Users')
 const db = mongoose.connection
 db.once('open',()=>{
    console.log("Mongodb connection successful")
 })

 const userSchema = new mongoose.Schema({
    regd_no:String,
    mobile:Number,
    email:String,
    name:String
 })

 const Users = mongoose.model("data",userSchema)

 app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'form.html'))
 })
 
 app.post('/post',async(req,res)=>{
    const {regd_no,mobile, email,name} = req.body
    const user = new Users({
        regd_no,
        mobile,
        email,
        name
    })
    await user.save()
    console.log(user)
   ' res.send("Form Submitted Suceessfully")'
   res.redirect('/')
    

 })

 app.listen(port,()=>{
    console.log("Server started")
 })
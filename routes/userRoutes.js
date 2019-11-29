const express = require('express');
const User = require('../database/models/userModel')
const auth = require('../middleware/auth')
const router = express.Router();


router.post('/user/signup',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save()
        const token = await user.generateAuthToken()
        return res.status(200).send({user,token})
    }catch(error){
        return res.status(400).send(error);
    }
})

router.post('/user/login',async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken();
        
        res.status(200).send({user,token});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.get('/user',auth,async (req,res)=>{
    try {
        const users = await User.find({})
        if(! users){
            return res.status(404).send("no user found")
        }
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.get('/user/:id',async (req,res)=>{
    const _id  = req.params.id
    try {
        const user  = await User.findById(_id);
        if(! user){
            return res.status(404).send("no usser with "+req.params.id+" id");
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error);
    }
})

router.patch('/user/:id',async (req,res)=>{

    try {
        const user = await User.findById(req.params.id);
        Object.keys(req.body).forEach(prop=>user[prop] = req.body[prop]);
        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/user/:id',async (req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            res.status(404).send("no user by this id "+req.params.id);
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports =router
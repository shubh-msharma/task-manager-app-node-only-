const express = require('express');
const User = require('../database/models/userModel')
const auth = require('../middleware/auth')
const router = express.Router();


router.post('/user/signup',async (req,res)=>{
    
    const user = new User(req.body);
    try{
        await user.save()
        const token = await user.generateAuthToken()
        return res.status(201).send({user,token})
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

router.post('/user/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(token=>{
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message);
    }
})

router.post('/user/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/user/me',auth,async (req,res)=>{
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error.message);
    }
})



router.patch('/user/me',auth,async (req,res)=>{

    try {
        const user = req.user;
        Object.keys(req.body).forEach(prop=>user[prop] = req.body[prop]);
        await user.save()
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/user/me',auth,async (req,res)=>{
    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports =router
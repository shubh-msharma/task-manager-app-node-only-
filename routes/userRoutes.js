const express = require('express');
const User = require('../database/models/userModel')
const auth = require('../middleware/auth')
const router = express.Router();
const multer = require('multer')
const fs = require('fs')


// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         fs.mkdirSync(`users/images/profile/${req.user._id}`, { recursive: true })
//         cb(null, `users/images/profile/${req.user._id}`)
//     },
//     filename: (req, file, cb) => {
//         if (file.originalname.endsWith('.jpg')) {
//             cb(null, file.fieldname + '-' + req.user.name + '.jpg')
//         }
//         if (file.originalname.endsWith('.pdf')) {
//             cb(null, file.fieldname + '-' + req.user.name + '.pdf')
//         }
//     }
// });

var upload = multer({
    // storage: storage,
    limits: {
        files: 10
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg)|(jpeg)|(png)$/)) {
            cb(new Error("only jpg files are allowed"))
        } else {
            cb(null, true);
        }
    }
});


router.post('/user/signup', async (req, res) => {

    const user = new User(req.body);
    try {
        await user.save()
        const token = await user.generateAuthToken()
        return res.status(201).send({ user, token })
    } catch (error) {
        return res.status(400).send(error);
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();

        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message);
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/user/me', auth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error.message);
    }
})



router.patch('/user/me', auth, async (req, res) => {

    try {
        const user = req.user;
        Object.keys(req.body).forEach(prop => user[prop] = req.body[prop]);
        await user.save()
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
})


router.post('/user/me/photos', auth, upload.array('upload'), async (req, res) => {
    req.files.forEach(file=>{
        req.user.uploads = req.user.uploads.concat({images:file.buffer})
    })
    try {
        await req.user.save()
        res.send();
    } catch (error) {
        res.send(error)
    }
    
},(error,req,res,next)=>{
    res.status(400).send(error);
})


router.post('/me/dp',auth,upload.single('avator'),async (req,res)=>{
    req.user.profilePic = req.file.buffer
    try {
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(400).send(error)
    }
},(error,req,res,next)=>{
    res.send(error.message)
})

router.delete('/me/dp',auth,async (req,res)=>{
    req.user.profilePic = undefined
    try {
        await req.user.save();
        res.status(201).send()
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/user/:id/avator',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        if(!user || !user.profilePic){
            throw new Error();
        }
        res.set('Content-Type','image/jpg').send(user.profilePic);
    } catch (error) {
        res.status(404).send()
    }
})


module.exports = router
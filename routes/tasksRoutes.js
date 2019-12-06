const express = require('express');
const Task = require('../database/models/taskModel')
const router = express.Router();
const auth = require('../middleware/auth')


router.post('/task/newtask',auth,async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
        });
    try{
        await task.save()
        return res.status(200).send(task)
    }catch(error){
        return res.status(400).send(error);
    }
})


router.get('/task',auth,async (req,res)=>{
    try {
        await req.user.populate({
            path:"task",
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip) 
            }
        }).execPopulate()
        res.status(200).send(req.user.task);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/task/complete',auth,async (req,res)=>{
    try {
        const tasks = await Task.findOne({completed:true,owner:req.user._id})
        if(! tasks){
            return res.status(404).send("no task found")
        }
        res.status(200).send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/task/incomplete',auth,async (req,res)=>{
    try {
        const tasks = await Task.findOne({completed:false,owner:req.user._id})
        if(! tasks){
            return res.status(404).send("no task found")
        }
        res.status(200).send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/task/:id',auth,async (req,res)=>{
    const _id  = req.params.id
    try {
        const task  = await Task.find({_id,owner:req.user._id});
        if(! task){
            return res.status(404).send("no usser with "+req.params.id+" id");
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error);
    }
})

router.patch('/task/:id',auth,async (req,res)=>{

    try {
        const task = await Task.find({_id:req.params.id,owner:req.user._id})
        Object.keys(req.body).forEach(prop=>task[prop] = erq.body[prop]);
        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/task/:id',auth,async (req,res)=>{
    try {
        const task = await Task.deleteOne({_id:req.params.id,owner:req.user._id});
        if(!task){
            res.status(404).send("no task by this id "+req.params.id);
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router
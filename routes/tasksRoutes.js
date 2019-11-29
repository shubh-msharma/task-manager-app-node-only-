const express = require('express');
const Task = require('../database/models/taskModel')
const router = express.Router();


router.post('/task/newtask',async (req,res)=>{
    const task = new Task(req.body);
    try{
        await task.save()
        return res.status(200).send(task)
    }catch(error){
        return res.status(400).send(error);
    }
})


router.get('/task',async (req,res)=>{
    try {
        const tasks = await Task.find({})
        if(! tasks){
            return res.status(404).send("no task found")
        }
        res.status(200).send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/task/complete',async (req,res)=>{
    try {
        const tasks = await Task.findOne({completed:true})
        if(! tasks){
            return res.status(404).send("no task found")
        }
        res.status(200).send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/task/incomplete',async (req,res)=>{
    try {
        const tasks = await Task.findOne({completed:false})
        if(! tasks){
            return res.status(404).send("no task found")
        }
        res.status(200).send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/task/:id',async (req,res)=>{
    const _id  = req.params.id
    try {
        const task  = await Task.findById(_id);
        if(! task){
            return res.status(404).send("no usser with "+req.params.id+" id");
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error);
    }
})

router.patch('/task/:id',async (req,res)=>{

    try {
        const task = await Task.findById(req.params.id)
        Object.keys(req.body).forEach(prop=>task[prop] = erq.body[prop]);
        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/task/:id',async (req,res)=>{
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            res.status(404).send("no task by this id "+req.params.id);
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router
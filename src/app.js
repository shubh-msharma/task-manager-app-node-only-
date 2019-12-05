const express = require('express');
require('../database/dbCon');
const userRouter = require('../routes/userRoutes')
const taskRouter = require('../routes/tasksRoutes')


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log("connected on "+port);
})

// const Task  = require('../database/models/taskModel');
// const User = require('../database/models/userModel')

// const main = async()=>{
//     // const task = await Task.findById('5de8fa9efde3b918544c413f');
//     // await task.populate('owner').execPopulate()
//     // console.log(task);
//     const user = await User.findById('5de20baa555c5f3218ada3ed');
//     await user.populate('task').execPopulate()

//     console.log(user.task);
// }

// main()
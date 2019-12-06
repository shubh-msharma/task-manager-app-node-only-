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

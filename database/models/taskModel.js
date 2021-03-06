const mongoose = require('mongoose');

const taskSchemaObject = {
    task:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
}

const taskSchema = new mongoose.Schema(taskSchemaObject,{timestamps:true});

const taskModel = mongoose.model("Task",taskSchema);

module.exports = taskModel
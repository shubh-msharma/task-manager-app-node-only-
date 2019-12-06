const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt  = require('bcryptjs');
const jwt =  require('jsonwebtoken');
const Task = require('./taskModel')

const uesrSchemaObject = {
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate(value){
            if(! validator.isEmail(value)){
                throw new Error("not a validate email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("password can not contian passowrd")
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    uploads:[{
        images:{
        type:mongoose.Schema.Types.Buffer}
    }],
    profilePic:{
        type:mongoose.Schema.Types.Buffer
    }
}

const userSchema =  new mongoose.Schema(uesrSchemaObject,{timestamps:true});

userSchema.virtual('task',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})


userSchema.methods.toJSON = function(){
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id:user._id.toString()},"iamprogrammer");
    user.tokens = user.tokens.concat({token});
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("incorrect user name or password");
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("incorrect user name or password");
    }
    return user
}


userSchema.pre('remove',async function(next){
    await Task.deleteMany({owner:this._id});
    next()
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8)
    }
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User

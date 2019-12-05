const jwt =  require('jsonwebtoken');
const User = require('../database/models/userModel')


const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ','');
    try {
        const decodedData = await jwt.verify(token,'iamprogrammer');
        if(!decodedData){
            throw new Error();
        }
        const user = await User.findOne({_id:decodedData._id,'tokens.token':token});
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
    } catch (error) {
        res.status(401).send(error)
    }
    next();
    
}

module.exports = auth
const auth = async(erq,res,next)=>{
    console.log("middleware fired")
    next();
}

module.exports = auth
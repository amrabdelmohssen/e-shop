function errorHander(err,req,res,next) {
    if(err.name === "validationError" ||err.name === "UnauthorizedError" ) return res.status(401).json({message : err.message})

    return res.status(500).json({message: err.message})

}

module.exports = errorHander
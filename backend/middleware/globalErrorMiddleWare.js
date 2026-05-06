const globalErrorMiddleware = (err,req,res,next)=>
{
    console.log(`Error Occured :${err ?.message}`)

    res.status(err.statusCode || 500).send({
        success :true,
        msg:err.message || "Internal Server Error",
        body :[]
    })
}

module.exports = globalErrorMiddleware
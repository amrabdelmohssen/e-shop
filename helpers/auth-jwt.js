const expressJwt = require('express-jwt')


function authJwt() {
    const secret = process.env.SECRET
    const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms: ['HS256'],
         isRevoked: isRevoked

    }).unless({
        path:[
            {url:/\/public\/uploads(.*)/,methods : ['GET','OPTIONS'] },
            {url:/\/api\/v1\/categories(.*)/,methods : ['GET','OPTIONS'] },
            {url:/\/api\/v1\/users(.*)/,methods : ['POST','OPTIONS'] },
            {url:/\/api\/v1\/products(.*)/,methods : ['GET','OPTIONS'] },
            `${api}/users/login`,
    ]
    })
}


async function isRevoked (req,payload,done){
    //done is function which has two params >> 1- err (any) 2-revoked (boolean)   
    if(!payload.isAdmin) return done(null,true)
    done()
}
module.exports = authJwt
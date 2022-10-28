const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
require('dotenv').config()
const User = require('../models/user')

exports.signup = async (req, res) => {
    // console.log('działa czy ni e działa')
    const userExists = await User.findOne({email: req.body.email})

    // console.log('userExists', userExists)

    if(userExists){
        return res.status(403).json({
            error: 'Ten email jest zajęty.'
        })
    }
    
        const user = await new User(req.body)
        // console.log('company', company)
        await user.save()
    // console.log('ddududuududududududu')
        res.json({message: 'Rejestracja zakończona powodzeniem! Możesz się zalogować.' })
    
    
}

////////////////////////////////////////////

exports.signin =  (req, res) => {

    // console.log('profile', req.profile)
    const { email, password } = req.body

        User.findOne({email}, (err, user) => {
            if(err || !user) {
                return res.status(401).json({
                    error: 'Błędne dane logowania'
                })
            }
    
            if(!user.authenticate(password)){
                return res.status(401).json({
                    error: 'Błędne dane logowania'
                })
            }
            req.user = user
            // console.log('req.user', req.user)


            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    
            res.cookie("t", token, {expire: new Date() + 9999})
    
            const { _id, email, userName, data, companyName, role } = user

            const unique = [...new Set(data.map(el => el.year))]
            console.log('unique', unique)
    
            return res.json({user: {token,_id, userName, email, data, companyName, role}, unique})
        }) 
    
}


exports.signout =  (req, res) => {
    res.clearCookie("t")
    return res.json({
        message: 'Signout success!!'
    })
}  

exports.currentUser = async (req, res) => {
    await User.findOne({email: req.user.email})
    .exec((err, user) => {
        if(err) throw new Error(err)
        res.json(user)
    })
}


exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    userProperty: "auth",
  });
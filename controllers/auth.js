const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const sgMail = require("@sendgrid/mail");
require('dotenv').config()
const User = require('../models/user')

exports.signup = async (req, res) => {

    // /

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

    sgMail.setApiKey(process.env.SENGRID_API_KEY);
if(req.body.role === 'admin'){
    const msg = {
        to:  req.body.email,
        from: "myhoursmanager@gmail.com",
        subject: 'Witamy w Menadżerze Godzin!',
        text: `Witaj ${req.body.userName}. Twoja firma została pomyślnie zarejestrowana w naszym serwisie.`
        };
    
        sgMail.send(msg)
        .then(response => console.log('Email to admin send...'))
        .catch(error => console.log(error))
}else {

    const admin = await User.findOne({_id: req.body.companyName})

    const msgToUser = {
        to:  req.body.email,
        from: "myhoursmanager@gmail.com",
        subject: 'Witamy w Menadżerze Godzin!',
        text: `Witaj ${req.body.userName}. Twoje konto zostało pomyślnie zarejestrowane w naszym serwisie. Możesz sie zalogować i dodawać przepracowane godziny.`
        };

     const msgToAdmin = {
        to:  admin.email,
        from: "myhoursmanager@gmail.com",
        subject: `${req.body.userName} zarejestrował się w naszym serwisie.`,
        text: `Witaj ${admin.userName}. ${req.body.userName} zarejestrował się w naszym serwisie jako pracownik Twojej firmy.`
     }   
    
        sgMail.send(msgToUser)
        .then(response => {
            console.log('Email to user...')
            sgMail.send(msgToAdmin)
            .then(response => console.log('Email to admin'))
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
}

    
    
    
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
    
            return res.json({user: {token,_id, userName, email, data, companyName, role}, unique})
        }) 
    
}


exports.signout =  (req, res) => {
    res.clearCookie("t")
    return res.json({
        message: 'Signout success!!'
    })
}  




exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    userProperty: "auth",
  });
const mongoose = require('mongoose')
const crypto = require('crypto')
const { ObjectId} = mongoose.Schema
const { v1: uuidv1 } = require('uuid');


const userSchema = new  mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    companyName:{
        type: String
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    company: String,
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: String,
    data:{
        type: Array,
        default: []
    }
},
{timestamps: true})


//VIrtual field

userSchema.virtual('password')
.set(function(password) {
    this._password = password
    // console.log('pasword', password)
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//methods

userSchema.methods = {
    authenticate: function(plainText){
        // console.log('22222222222222222')
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password){
        
        if(!password) return ''
        // console.log('no password')
        try {
            // console.log('3333333333333333')
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch (err) {
            return ''
        }
    }
}

module.exports = mongoose.model('User', userSchema)
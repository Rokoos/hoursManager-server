const express = require('express')
const router = express.Router()

const { getCompanies} = require('../controllers/company')

// const { userById} = require('../controllers/user')



router.get('/getCompanies',getCompanies)

//any route containing :userId our app will first execute userById()
// router.param('userId', userById)

module.exports = router
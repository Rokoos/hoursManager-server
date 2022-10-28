const express = require('express')
const router = express.Router()

const { usersByCompany, getUser, userById, handleHours, getData, getMonth } = require('../controllers/user')
const { currentUser, requireSignin} = require('../controllers/auth')

const { adminCheck} = require('../middlewares/auth')

// const { userSignupValidator} = require('../validator')

router.get('/getUsers/:id', usersByCompany)
router.get('/user/:userId', requireSignin, getUser)
router.get('/user/:userId/:year',requireSignin, getData)
router.get('/user/:userId/:year/:month',requireSignin,getMonth)
router.post('/user/:userId/addHours',requireSignin, handleHours)
// router.post('/current-admin',  adminCheck, currentUser)
// router.post('/', signin)
// router.get('/signout', signout)

//any route containing :userId our app will first execute userById()
router.param('userId', userById)

module.exports = router

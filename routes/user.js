const express = require('express')
const router = express.Router()

const { 
  usersByCompany, 
  getUser, userById, 
  handleHours, 
  getData, 
  getMonth,
  deleteUser
} = require('../controllers/user')
const { requireSignin} = require('../controllers/auth')




router.get('/getUsers/:id', usersByCompany)
router.get('/user/:userId', requireSignin, getUser)
router.delete('/user/:userId', requireSignin, deleteUser)
router.get('/user/:userId/:year',requireSignin, getData)
router.get('/user/:userId/:year/:month',requireSignin,getMonth)
router.post('/user/:userId/addHours',requireSignin, handleHours)

//any route containing :userId our app will first execute userById()
router.param('userId', userById)

module.exports = router

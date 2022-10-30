const express = require('express')
const router = express.Router()

const { userById, getUser, usersByCompany } = require('../controllers/user')
const { getEmployee, getEmployeeWeeks} = require('../controllers/admin')
const {requireSignin} = require('../controllers/auth')
const { adminCheck} = require('../middlewares/auth')

router.get('/admin/:userId', requireSignin, adminCheck, getUser)
router.get('/admin/:userId/workers', requireSignin ,adminCheck, usersByCompany)
router.get('/admin/:userId/user/:id', requireSignin, adminCheck, getEmployee)
router.get('/admin/:userId/user/:id/:year', requireSignin ,adminCheck, getEmployeeWeeks)

//any route containing :userId our app will first execute userById()
router.param('userId', userById)
module.exports = router
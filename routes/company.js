const express = require('express')
const router = express.Router()

const { getCompanies} = require('../controllers/company')

router.get('/getCompanies',getCompanies)



module.exports = router
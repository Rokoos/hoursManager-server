const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')
const path = require('path')

//bring routes
// const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const companyRoutes = require('./routes/company')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('DB connected!!'))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
})

// middleware

app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

//posts api
// app.use('/api', postRoutes)
app.use('/api', authRoutes)
app.use('/api', companyRoutes)
app.use('/api', userRoutes)
app.use('/api', adminRoutes)

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: 'Unauthorized'
        })
    }
});


//for Heroku!!
// app.use(express.static('../client/build'))
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
// })
//for Heroku!!
// app.use(express.static('../client/build'))
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
// })

const port = process.env.PORT || 5000

app.listen(port, () => {
    'Server is up and running!'
})
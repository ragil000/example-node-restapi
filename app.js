const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const env = require('dotenv')

env.config()

// calling routes
const accountRoutes = require('./api/routes/accountRoute')

const mongoDBURI = process.env.MONGO_DB_URI
mongoose.connect(`mongodb:${mongoDBURI}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// handle CORS
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Language')
    if(request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        return response.status(200).json({})
    }
    next()
})

app.use('/accounts', accountRoutes)

// error handling
app.use((request, response, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, request, response, next) => {
    response.status(error.status || 500)
    response.json({
        error: {
            message: error.message || 'Server error'
        }
    })
})

module.exports = app
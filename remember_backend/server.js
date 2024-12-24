const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db.js')
// DOTENV
dotenv.config();

// MONGODB connection

connectDB();

// Rest object
const backend = express()

//middlewares
backend.use(cors())
backend.use(express.json())
backend.use(morgan('dev'))

//Routes
backend.use('/api/v1/auth', require('./routes/userRoutes.js'))
backend.use('/api/v1/routes', require('./routes/routeRoutes.js')) // Add this line
backend.use('/api/v1/one', require('./routes/oneRoutes.js')) // Add this line
backend.use('/api/v1/two', require('./routes/twoRoutes.js')) // Add this line

//Port
const PORT = process.env.PORT || 4000

//Listening
backend.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.bgGreen.white);
})
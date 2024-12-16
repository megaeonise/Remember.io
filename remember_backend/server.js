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
backend.use('/api/v1/auth',require('./routes/userRoutes.js'))

//Port
const PORT = process.env.PORT || 4000

//Listening
backend.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.bgGreen.white);
}
)
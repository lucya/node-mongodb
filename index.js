const express = require('express')
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config();

//Connect to MongoDB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  })

//Middleware
app.use(express.json())

//Import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

//Rotue Middleware
app.use('/api/users', authRoute)
app.use('/api/posts', postRoute)

app.listen(5002, () => console.log('Server Up and Running on 5002 port'));
const router = require("express").Router();
const User = require("../model/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require('../validation')


router.post('/register', async (req, res) => {

  //LETS VALIDATE THE DATA BEFORE WE A USER
  const { error } = await registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //Checking if the user is already registered
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send('Email already registered')

  //Hash passwords
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  //Create a new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  })

  try {
    const savedUser = await user.save();
    res.send({ user: user._id })
  } catch (err) {
    res.status(400).send(err)
  }
})

//LOGIN
router.get('/login', async (req, res) => {
  //LETS VALIDATE THE DATA BEFORE WE A USER
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //Checking if the user is not registered
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Email is not registered')

  //PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid password')

  //Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token)

  res.send('Logged in!')


})

module.exports = router;
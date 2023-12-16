const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = require('../middleware/fetchuser');
let success = false;

//create a user using post "/api/auth/createuser" doesnt require login
router.post('/createuser', [
  body('name', 'Enter A Valid Name').isLength({ min: 3 }).trim(),
  body('email', 'Enter A Valid Email').isEmail().normalizeEmail(),
  body('password', 'Enter A Valid Password').isLength({ min: 3 }).trim(),

], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      success = false;
      return res.status(400).json({ success, ErrorMessage: "Sorry A User With This Email Already Exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPassword,
    })

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign({ data }, JWT_SECRET);
    success = true;
    return res.json({authtoken, success});



  } catch (error) {
    success = false;
    console.error(error);
    return res.status(500).json({ success, errorMessage: "Internal Server Error." });

  }

})

//login a user using post "/api/auth/login" doesnt require login
router.post('/login', [
  body('email', 'Enter A Valid Email').isEmail().normalizeEmail().exists(),
  body('password', 'Enter A Valid Password').trim().exists(),

], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {

    const { email, password } = req.body;

    let user = await User.findOne({ email }, { id: 1, password: 1 });
    if (!user) {
      success = false;

      return res.status(401).json({ success, ErrorMessage: "Please Login With Correct Credentials." });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      success = false;

      return res.status(401).json({ success, ErrorMessage: "Please Login With Correct Credentials." });
    }


    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign({ data }, JWT_SECRET);
    success = true;
    return res.json({authtoken, success});


  } catch (error) {
    success = false;
    console.error(error);
    return res.status(500).json({ success, errorMessage: "Internal Server Error." });

  }

})


//get user details using post "/api/auth/getuser" require login
router.post('/getuser', fetchuser, async (req, res) => {

  try {
    const userid = req.user.id;
    let user = await User.findById(userid, { password: 0 });
    success = true;
    return res.json({ success, user });

  } catch (error) {
    success = false;
    console.error(error);
    return res.status(500).json({ success, errorMessage: "Internal Server Error." });
  }

})



module.exports = router;
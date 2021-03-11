
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

router.post('/', async (req,res) =>{
    try{
        let {name, email, username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        User.create({
            name,
            email,
            password: hashedPassword,
            username
        }).then(user =>{
          console.log(user);
          res.redirect('/login');
        })
        .catch(err => console.log(err));

    }
    catch(err){
         console.log(err);
         res.redirect('/register');
        }
  
})
module.exports = router;
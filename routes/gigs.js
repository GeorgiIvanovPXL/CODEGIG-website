const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session')


const initializePassport = require('../passportConfig');

initializePassport(passport);




router.use(passport.initialize());
router.use(passport.session());
router.use(flash());



// GET gig list

router.get('/', (req,res) =>{
    Gig.findAll()
.then(gigs => {
    // console.log(gigs);
    res.render('gigs', {gigs});
})
.catch(err => console.log(err));
})



// Display form for adding gig

router.get('/add', checkNotAuthenticated, (req,res) =>{
    res.render('add');
})

// ADD a gig

router.post('/add', checkNotAuthenticated, (req,res) =>{
  
    let {title, technologies, budget, description, contact_email} = req.body;
    let errors = [];

    //Validate fields

    if(!title) {
        errors.push({text: 'Voeg aub een titel toe!'})
    }

    if(!technologies) {
        errors.push({text: 'Voeg vereiste technologieën toe!'})
    }

    if(!description) {
        errors.push({text: 'Voeg aub een omschrijving toe!'})
    }

    if(!contact_email) {
        errors.push({text: 'Voeg aub een email toe!'})
    }

    // Check for errors

    if(errors.length > 0){
        res.render('add',{
            errors,
            title,
            technologies,
            description,
            budget,
            contact_email
        })
    }else{

        if(!budget){
            budget = 'Unknown'
        }
        else{
            budget = `$ €{budget}`
        }


        // Make lowercase and remove space after comma
        technologies = technologies.toLowerCase().replace(/, /g, ',');

    // Insert into table
    Gig.create({
        title,
        technologies,
        description,
        budget,
        contact_email
    }).then(gig => res.redirect('/gigs'))
    .catch(err => console.log(err));
    }

  
 })

 // Search for gigs

 router.get('/search', (req,res) =>{
     let {term} = req.query;
     // Make the term lowercase
     term = term.toLowerCase();
     const gigs = Gig.findAll({where: { technologies: {[Op.like]: '%'+ term +'%' } } } )
     .then(gigs => res.render('gigs', {gigs}))
     .catch(err => console.log(err))
 })




 function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/index')
    }
    next();
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('success_msg', "You have to login to add a Gig!");
    res.redirect('/login')
}



module.exports = router;
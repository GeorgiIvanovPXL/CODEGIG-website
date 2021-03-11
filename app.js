const express = require('express');
const path = require('path');
const User = require('./models/User');
const db = require('./config/database');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {Op} =  require('sequelize');
const session = require('express-session');
const flash = require('express-flash');



const initializePassport = require('./passportConfig');

initializePassport(passport);

// TEST DB
db.authenticate()
.then(() => console.log('DATABASE CONNECTED...'))
.catch(err => console.log(err))
const app = express();



app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}));

app.use(session({
    secret: 'secretKeyOmgToTHeCasTLEBuTDonttellAnyone',

    resave: false,

    saveUninitialized: false

}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




// // Handlebars 
// app.engine('handlebars', eh({
//      defaultLayout: 'main',
//      handlebars: allowInsecurePrototypeAccess(Handlebars)}));

// app.set('view engine', 'handlebars')


// // Body Parser
// app.use(bodyParser.urlencoded({extended:false}));

// SET STATIC FOLDER

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));


// Index route

app.get('/', checkNotAuthenticated, (req,res) =>{
    res.render('index', { layout: 'landing'});
})

// GIg routes
app.use('/gigs', require('./routes/gigs'));

app.get('/register',checkAuthenticated,(req,res) =>{
    res.render('register');
})


app.post('/register', async (req, res) => {  
    let { name, email, password, username} = req.body;
    // pool.query('INSERT INTO users ()')
    console.log({
        name,
        email,
        password,
        username
    });
    let errors = [];

    if(!name || !email || !password || !username){
        errors.push({
            message:'Please fill all the fields out!'
        })
    }

    if(password.length < 6){
        errors.push({
            message:'Password should be at least 6 characters long!'
        })
    }

    if(errors.length > 0){
        res.render('register',{errors})
    }else{
        // Form validation has passed!
        //
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);


        // VERSIE MET SEQUELIZE

         User.findAll({where:{email:{[Op.eq]: email}}})
         .then(users => {
             console.log(users)
             if(users.length > 0){
                 errors.push({message: 'Email already exists'});
                 res.render('register', {errors});
             }
             else{
                 User.create({
                     name,
                     email,
                     password: hashedPassword
                 })
                 .then(user => {
                     console.log(user)
                     req.flash('success_msg', "you are now registered, Please log in!");
                     res.redirect('/login')
                 })
                 .catch(err => {throw err})
             }
         })
         .catch(err => {throw err})




          // PG VERSIE ZONDER SEQUELIZE


        // pool.query(
        //     'SELECT * FROM users WHERE email = $1',[email],
        //     (err, results) =>{
        //         if(err){
        //             throw err;
        //         }
        //         else{
        //             console.log(results.rows)
        //             if(results.rows.length > 0){
        //                 errors.push({
        //                     message: 'Email already exists'
        //                 });
        //                 res.render('register', {errors});
        //             }
        //             else{
        //                 pool.query(
        //                     `INSERT INTO users (name, email, password)
        //                     VALUES($1,$2,$3)
        //                     RETURNING id, password`, [name, email, hashedPassword],
        //                     (err, results) =>{
        //                         if(err){
        //                             throw err;
        //                         }
        //                         console.log(results.rows)
        //                         req.flash('success_msg', "you are now registered, Please log in!");
        //                         res.redirect('/users/login')
        //                     }

        //                 )
        //             }
        //         }
        //     }
        // )




    }

})





app.get('/login', checkAuthenticated, (req, res) =>{
    res.render('login');
})

app.post('/login', passport.authenticate('local', {
    
    successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash: true
}))


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





const PORT = process.env.PORT || 5000;





app.listen(PORT, () =>{
    console.log(`APP LISTENING ON PORT ${PORT}`);
})
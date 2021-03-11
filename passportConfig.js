const LocalStrategy = require('passport-local').Strategy;
const db = require('./config/database');
const passport = require('passport');
const User = require('./models/User');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');



function initialize(passport){
    const authenticateUser =  (email, password, done) =>{
        


        User.findAll({where:{email:{[Op.eq]: email}}})
        .then(users => {
            console.log(users)
            if(users.length > 0){
                const user = users[0];

                bcrypt.compare(password, user.password, (err, isMatch) =>{
                    if(err){
                        throw err;
                    }
                    if(isMatch){
                        return done(null, user)
                    }else{
                        return done(null, false, {message: 'Wrong password'})
                    }
                })

            }else{
                return done(null, false, {message: 'Email is not registered!'})
            }
           
        }).catch(err => {throw err})
    



        // WiTH pg-library
        
        // pool.query(
        //     `SELECT * FROM users WHERE email = $1`, [email],
        //     (err, results) =>{
        //         if(err){
        //             throw err;
        //         }
        //         console.log(results.rows);
        //         if(results.rows.length > 0){
        //             const user = results.rows[0];

        //            bcrypt.compare(password, user.password, (err, isMatch) =>{
        //                 if(err){
        //                     throw err
        //                 }
        //                 if(isMatch){
        //                     return done(null, user)
        //                 }else{
        //                     return done(null, false, {message: 'Wrong password'})
        //                 }
        //             })
        //         }else{
        //             return done(null, false, {message: 'Email is not registered!'})
        //         }

        //     }
                
            
        // )




    }
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: "password"
    }, authenticateUser));
    passport.serializeUser((user, done) =>done(null, user.id));
    passport.deserializeUser((id, done) => {


        User.findAll({where:{id:{[Op.eq]: id}}})
        .then(users => {
            return done(null, users[0]);
        })
        .catch(err => {throw err})



        // pool.query(
        //     `SELECT * FROM users WHERE id = $1`, [id],(err, results) =>{
        //         if(err){
        //             throw err;
        //         }
        //         else{
        //             return done(null, results.rows[0])
        //         }
        //     }
        // )



    })
}



module.exports = initialize;
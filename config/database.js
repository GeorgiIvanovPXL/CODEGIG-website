require('dotenv').config();

// const {Pool} = require('pg');


// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// const pool = new Pool({
//     connectionString: isProduction ? process.env.DB_DATABASE_URL : connectionString
// })

// module.exports = pool;

const Sequelize = require('sequelize');
const db = new Sequelize('codegig','admin', `27017878389653Gg*`,{
    host: `localhost`,
    dialect: 'postgres',
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');

/*const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });*/

const dotenv = require('dotenv').config('../.env');

console.log("DB_USERNAME dotenv: " + dotenv);
console.log("DB_USERNAME DB_CLIENT_USERNAME: " + process.env.MONGODB_USER);

//const DB_USERNAME = process.env.DB_CLIENT_USERNAME;
//const DB_PASSWORD = process.env.DB_CLIENT_PASSWORD;

const DB_USERNAME = "Client";
const DB_PASSWORD = "clientmongo2000";

//-------------------------

mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@database.emdt5lw.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/auth', userRoute);

module.exports = app;
const express = require('express')

const app = express()
const mongoose = require('mongoose')

//ROUTES
const RoutesDemand = require('./routes/routes')
const UserRoute = require('./routes/RouteUser')

mongoose.connect('',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// CORS - Cross Origin Resource Sharing
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


//Enregistrement routes 
app.use('/api/saucemodel', RoutesDemand)
app.use('/api/auth', UserRoute)
module.exports = app;

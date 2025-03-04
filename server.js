const express = require('express');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./api/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const {Logger} = require('./middlewares/logger');
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/home', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views/register.html'));
})

app.get('/about', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views/AboutUs.html'));
})

// Global middlewares
app.use(Logger);
app.use(errorHandler);

// app listening
app.listen(8080);
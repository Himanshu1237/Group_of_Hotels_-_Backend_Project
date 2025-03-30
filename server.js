const express = require('express');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./api/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { Logger } = require('./middlewares/logger');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/home', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/about', (req, res) => {
    res.render('AboutUs');
});

app.get('/crismas', (req, res) => {
    res.render('ChristmasOffer');
});

app.get('/book', (req, res) => {
    res.render('hotelbooking');
});

app.get('/contact', (req, res) => {
    res.render('privacy');
});

app.get('/terms', (req, res) => {
    res.render('terms');
});

app.get('/beachfront', (req, res) => {
    res.render('Beachfront');
});

app.get('/UrbanOasis', (req, res) => {
    res.render('UrbanOasis');
});

app.get('/Mountainescape', (req, res) => {
    res.render('Mountainescape');
});

// Global middlewares
app.use(Logger);
app.use(errorHandler);

// app listening
app.listen(8080);

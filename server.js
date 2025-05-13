const express = require('express');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./api/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { Logger } = require('./middlewares/logger');
const app = express();
const hotels = require('./models/hotels.json');

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
    res.render('index', {title:"RoyalNest", hotels});
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


const roomTypes = [
    { value: "single", name: "Single" },
    { value: "double", name: "Double" },
    { value: "suite", name: "Suite" },
    { value: "deluxe", name: "Deluxe" }
];

app.get('/book', (req, res) => {
    const year = new Date().getFullYear();
    const selectedHotel = req.query.hotel;
    console.log("selectedHotel " + selectedHotel);
    const imgURL = hotels.find(hotel => hotel.link === selectedHotel)?.image || '/images/default-image.jpg';
    console.log("imgURL " + imgURL);
    res.render('hotelbooking', {
        title: "Book a Room",
        activePage: "book",
        hotels,
        roomTypes,
        year,
        selectedHotel,
        imgURL
    });
});

app.post('/book', (req, res) => {
    const { hotelName, checkInDate, checkOutDate, roomType } = req.body;
    // Here you would typically handle the booking logic
    console.log(`Booking request for ${hotelName} from ${checkInDate} to ${checkOutDate} in a ${roomType} room.`);
    res.redirect('/home');
});


app.get('/contact', (req, res) => {
    res.render('privacy');
});

app.get('/terms', (req, res) => {
    res.render('terms');
});

app.get('/Beachfront', (req, res) => {
    res.render('Beachfront');
});

app.get('/UrbanOasis', (req, res) => {
    res.render('UrbanOasis');
});

app.get('/MountainEscape', (req, res) => {
    res.render('MountainEscape');
});
app.get('/TheRitzLondon', (req, res) => {
    res.render('TheRitzLondon');
});

app.get('/TheRitzBali', (req, res) => {
    res.render('TheRitzBali');
});
// Global middlewares
app.use(Logger);
app.use(errorHandler);

// app listening
app.listen(8080);

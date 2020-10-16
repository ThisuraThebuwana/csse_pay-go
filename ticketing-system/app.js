const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const passengerRoutes = require('./api/routes/passengers');
const routeRoutes = require('./api/routes/routs');
const rideRoutes = require('./api/routes/rides');
const qrRoutes = require('./api/routes/qr');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes handling
app.use('/products', productRoutes);
app.use('/passengers', passengerRoutes);
app.use('/routes', routeRoutes);
app.use('/rides', rideRoutes);
app.use('/qr', qrRoutes);


//DB connection
mongoose.connect('mongodb+srv://Admin:admin@ticketingsystem.n1tnn.mongodb.net/TicketingSystemDB?retryWrites=true&w=majority', (err)=>{
    if(err){
        console.log(err);
        process.exit(-1);
    }
    console.log('Connected to the DB')
});

//Error handling
app.use((req, res, next)=>{
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next)=>{
    res.status(error.status || 500).json({
        error:{
            message: error.message
        }
    });
});


module.exports = app;

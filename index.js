const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const db= require('./config/mongoose');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const port = 5000;


// To server Css,Js and other media files to ejs 
app.use(express.static(path.join(__dirname, 'assets')))

// This is using to Setup Ejs for dynamic Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());   

app.use(expressEjsLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



// app.get('/', function (req, res) {
//     console.log(__dirname);
//     // res.send('<h1>Cool, It is Running on Port</h1>')

//     return res.render('home', { title: 'My Contact List', name: 'Ankit Bhagwan Patwa' })
// });

// Use Express Router
app.use('/',require('./routes'))

app.listen(port, function (err) {
    if (err) {
        console.log('Error in Server');
    }

    console.log('My Express Js is Running')
});


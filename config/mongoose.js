const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Coolest:QVpsSMZaPbWTtalo@habittraker.m3ze8oc.mongodb.net/HabitTraker?retryWrites=true&w=majority',{useNewUrlParser:true})

const db = mongoose.connection;

db.on('error', console.error.bind(console,'Database Connection error :'));
db.once('open', function(){
    console.log('Database Connected !!!')
});

module.exports  = db;

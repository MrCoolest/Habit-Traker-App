const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/habitTracker',{useNewUrlParser:true})

const db = mongoose.connection;

db.on('error', console.error.bind(console,'Database Connection error :'));
db.once('open', function(){
    console.log('Database Connected !!!')
});

module.exports  = db;
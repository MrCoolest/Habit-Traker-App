const mongoose = require("mongoose");

const datesSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    status :{
        type : Boolean,
        required :true
    },
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
    }
},{
    timestamps: true
});

const Dates = mongoose.model('Dates', datesSchema);
module.exports = Dates;
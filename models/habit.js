const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    habit_name: {
        type: String,
        required: true
    },
    record_tracker: {
        type: Map
    },
    streak:{
        type:Number,
        default:0
    },
    dates: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Dates'
        }
    ],
},{
    timestamps: true
})

// creating a model for habit schema
const Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit;
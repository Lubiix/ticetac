var mongoose = require('mongoose')

var lastTripSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
})

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    lastTrip:[lastTripSchema]
})

var UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;

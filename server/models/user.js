var mongoose = require('mongoose')
var schema = mongoose.Schema

var userSchema = new Schema({
	email: String,
	firstName: String,
	lastName: String,
	passwordHash: String,
	passwordSalt: String
});


module.exports = mongoose.model('User', userSchema); 
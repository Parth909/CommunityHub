const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HubSchema = new Schema({
	title: String
});

module.exports = mongoose.model('Hub', HubSchema);

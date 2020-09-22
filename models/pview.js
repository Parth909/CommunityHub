const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PviewSchema = new Schema({
	body: String,
	// rating: Number,
	author: {
		type: Schema.Types.ObjectId,//stores id's which refer to user schema
		ref: 'User'
	}
});

module.exports = mongoose.model('Pview', PviewSchema);

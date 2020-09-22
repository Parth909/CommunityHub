const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');

const trendingSchema = new Schema({
	const trendingposts = [{
		type: Schema.Types.ObjectId,
		ref: 'Post'
	}]
});

module.exports = mongoose.model('Trending', trendingSchema);
//this schema can be applied to all categories
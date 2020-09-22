const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Topic = require('./topic');
//these are different types of post

const sharedPostSchema = new Schema({
	title: String,
    description: String,
    author: {
       	type: Schema.Types.ObjectId,
       	ref: 'User'
    },
	shpost: {// shared posts

		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	pviews: [//many pviews on one post
		{
			type: Schema.Types.ObjectId,
			ref: 'Pview'
		}
	],
	supporters:[
		{
			type:Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	topic:{
		type: Schema.Types.ObjectId,
		ref:  'Topic'
	},
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('SharedPost', sharedPostSchema);
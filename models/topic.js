const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Hub = require('./hub');
const Post = require('./post')
const mongoosePaginate = require('mongoose-paginate-v2');

//remember for displaying post that belong to a particular category 
//need to populate it from the Post model for postindexofcategory
//try{Post.find({category: req.params.category})}catch(e){console.log(err)};

const TopicSchema = new Schema({
	title: String,
	tagline: String,
	hub:{
		type: Schema.Types.ObjectId,
		ref: 'Hub'		
	},
	logo: [//the default image will be given in the view itself(bcz it is an arrya can't give default here)
		{ 
			url: String, 
			public_id: String 
		}
	],
	coverImage: { type: String, default: '/images/cover1.jpg' },//bcz it is already in our images dir
	tags: Array,
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	followers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	settings:{
		dispTopicCreator: false,
	},
	posts:[
		{
			type:  Schema.Types.ObjectId,
			ref: 'Post'
		}
	],
	pinnedMsgs: [
		{
			type:String
		}
	],
	time: { type : Date, default: Date.now }
//can add additional functionality like admins to manage the channel
//with some special privileges 
//a
});

//**remember the user cannot delete the topic once the posts go beyond a particular no/followers 
//**go beyond a particular no
TopicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Topic', TopicSchema);

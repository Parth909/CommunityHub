//remember U can always add something in schema subtraction will cause huge problem
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const Topic = require('./topic');
const Post = require('./post')

const UserSchema = new Schema({
	email: {type: String, unique: true, required: true},
	profimage: {
		secure_url: { type: String, default: '/images/default-profile.jpg' },
		public_id: String
	},
	backimage: {
		secure_url: { type: String, default: '/images/backimg.jpg' },
		public_id: String
	},
	status: String,
	nickname: String,
	site: String,
	bornday: String,
	bornmonth: String,
	bornyear: String,
	location: String,
	bookmarks: [ 
		{
			type: Schema.Types.ObjectId, //this bookmark is nothing but an array of postids
			ref: 'Post'
		}
 	],
	followers:{ 
		private:{type:Boolean, default:false},
		actFollowers:[
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
		]
	},
	following:{ 
		private:{type:Boolean, default:false},
		actFollowing:[
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		]
	},
	// although the followers are present in 'topic' model added here as well
	// so don't need to search through the 'followers' of all 'topics' to find the topics the user is following
	// and having the followers in the topic is also imp so that 'special things related to that topic' can be posted to the followers of that topic
	followingTopics:{
		private:{type:Boolean, default:false},
		actFollowingTopics:[
			{
	             type: Schema.Types.ObjectId,
	             ref: 'Topic'
	        }
		]
	},
	// We can't search all the topics for 'our topic'
	myTopics:{
		private:{type:Boolean, default:false},
		actMyTopics:[
			{
				type: Schema.Types.ObjectId,
				ref:'Topic'
			}
		]
	},
	commentXP:{type:Number, default:0},
	postXP:{type:Number, default:0},
	shareXP:{type:Number, default:0},
	likeXP:{type:Number, default:0},
	createdAt: { type : Date, default: Date.now },
	updatedAt:{type:Date},
	resetPasswordToken: String,  //creating unique password token using crypto
	resetPasswordExpires: Date
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

//User is deleted pviews,posts will also be deleted(need to figure it out)
// UserSchema.pre('remove', async function() { 
// 	await Posts.remove({
// 		_id: {
// 			$in: this.posts;
// 		}
// 	});
// });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
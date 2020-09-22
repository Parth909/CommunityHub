const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Pview = require('./pview');
const User = require('./user');
const Topic = require('./topic');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
	mood:String,
	title: String,
	description: String,
	images: [ { url: String, public_id: String } ],
	video:{
		secure_url: String,
		public_id: String
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	pviews: [//many pviews on one post
		{
			type: Schema.Types.ObjectId,
			ref: 'Pview'
		}
	],
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],//so that User can be redirected to that particular category
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
	time : { type : Date, default: Date.now }
	// avgRating: { type: Number, default: 0 }
});

PostSchema.pre('remove', async function() { //Post is deleted pviews will also be deleted
	await Pview.remove({
		_id: {
			$in: this.pviews
		}
	});
});



//If a particular posts get deleted the bookmarks nee to be deleted

// PostSchema.methods.calculateAvgRating = function() {
// 	let ratingsTotal = 0;
// 	if(this.pviews.length) {
// 		this.pviews.forEach(pview => {
// 			ratingsTotal += pview.rating;
// 		});
// 		this.avgRating = Math.round((ratingsTotal / this.pviews.length) * 10) / 10;
// 	} else {
// 		this.avgRating = ratingsTotal;
// 	}
// 	const floorRating = Math.floor(this.avgRating);
// 	this.save();
// 	return floorRating;
// }

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);

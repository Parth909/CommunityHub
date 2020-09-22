const Post = require('../models/post');
const Pview = require('../models/pview');
const SharedPost = require('../models/share');
const Topic = require('../models/topic');
const User = require('../models/user');
const util = require('util');

module.exports = {
	// pviews Create
	async pviewCreate(req, res, next) {
		// find the post by its id and populate pviews
		const user = await User.findById(req.user._id);

		let modelObj;
		if(req.params.type === 'SHARED_POST'){
		debugger;

			modelObj = await SharedPost.findById(req.params.id).populate('pviews').exec();
		}else{
			debugger;
			modelObj = await Post.findById(req.params.id).populate('pviews').exec();
		}
		// filter post.pviews to see if any of the pviews were created by logged in user
		// .filter() returns a new array, so use .length to see if array is empty or not

		// let havepviewed = modelObj.pviews.some(pview => {
		// 	return pview.author.equals(req.user._id);
		// }).length;

		// check if havepviewed is 0 (false) or 1 (true)
		// if(havepviewed) {
		// 	// flash an error and redirect back to post
		// 	req.session.error = 'Sorry, you can only create one Comment per post.';
		// 	return res.send('alreadyCommented');
		// }

		// create the pview(saved with the help of pview model)
		//the author is not entered in the form so in the request coming from the "form" we add the author
		req.body.pview.author = req.user._id;
		let pview = new Pview(req.body.pview);

		user.commentXP += 1;

		await pview.save();
		debugger;
		// assign pview to post
		modelObj.pviews.push(pview);
		// save the post
		modelObj.save();
		// redirect to the post
		let ppview = await Pview.findById(pview._id).populate({path:'author', model:'User'});

		let topic = await Topic.findById(req.params.topic_id);

		// adding specific XP to the user
		await user.save();
		const login = await util.promisify(req.login.bind(req));
		await login(user);

		// req.session.success = 'Comment created!';

		debugger;

		res.json({topic, modelObj, ppview});
	},
	// pviews Update
	async pviewUpdate(req, res, next) {
		await Pview.findByIdAndUpdate(req.params.pview_id, req.body.pview);
		let pview = await Pview.findById(req.params.pview_id).populate({
			path: 'author',
			model: 'User'
		});
		// req.session.success = 'Comment updated successfully!';
		res.json(pview);
	},
	// pviews Destroy
	async pviewDestroy(req, res, next) {
		// debugger;
		const user = await User.findById(req.user._id);

		let post;
		if(req.params.type === 'SHARED_POST'){
			await SharedPost.findByIdAndUpdate(req.params.id, { //removing from the pview array 
				$pull: { pviews: req.params.pview_id }
			});	

			post = await SharedPost.findById(req.params.id);
		}else{
			await Post.findByIdAndUpdate(req.params.id, { //removing from the pview array 
				$pull: { pviews: req.params.pview_id }
			});	
			post = await Post.findById(req.params.id);

		}

		user.commentXP -= 1;

		// adding specific XP to the user
		await user.save();
		const login = await util.promisify(req.login.bind(req));
		await login(user);

		await Pview.findByIdAndRemove(req.params.pview_id);//removing from the collection
		// req.session.success = 'Comment deleted successfully!';
		res.json(post);
	}
}
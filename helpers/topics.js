const Topic  = require('../models/topic');
const Post = require('../models/post');
const SharedPost = require('../models/share');
module.exports = {
	async isTopicCreator(req, res, next){
		const topic = await Topic.findById(req.params.id);

		if(req.user._id === topic.owner._id){
			req.creator = true;
			next();
		}else{
			req.creator = false;
			next();
		}		
	},

	findHub(req, res, next){
		
		debugger;
		if(req.query.hasOwnProperty('hub_title')){
			req.body.hub_title = req.query.hub_title;
			return next();
		}else{
			req.body.hub_title = 'hangout hub';
			return next();
		}

	},

	async topicContent(req, res, next){

		res.locals.topic = await Topic.findById(req.params.topic_id).populate(
		{
			path:'owner',
			model:'User'
		});

		//finding only the posts of that topic
		const postsOfTopic = await Topic.findById(req.params.topic_id).populate(
		{
			path:'posts',
			model:'Post'
		});

		//finding only the sharedposts of that topic
		const sharesOfTopic = await Topic.findById(req.params.topic_id).populate(
		{
			path:'posts',
			model:'SharedPost'
		});

		res.locals.myPosts = postsOfTopic.posts.filter( post => {
			return post.author.equals(req.user._id);
		});

		res.locals.myShares = sharesOfTopic.posts.filter(share=>{
			return share.author.equals(req.user._id);
		});

		next();
	}
}
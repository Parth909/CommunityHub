const async = require('async');
const Post = require('../models/post');
const SharedPost = require('../models/share');
const Pview = require('../models/pview');
const User = require('../models/user');
const Topic = require('../models/topic');
const util = require('util');
const { cloudinary } = require('../cloudinary');
const isImage = require('is-image');
const isVideo = require('is-video');
module.exports = {
	// Posts Index
	async postIndex(req, res) {
//Post.find({topic:'req.params.topic_id'})
		let topic = res.locals.topic;

		let myPosts = res.locals.myPosts;

		let myShares = res.locals.myShares;

		delete res.locals.myShares;
		delete res.locals.myPosts;
		delete res.locals.topic;
		//adding the "id" of the "topic" in the post as well to find it easily
		let posts = await Post.find({}).where('topic').equals(req.params.topic_id).sort({"_id":-1}).populate(
				{
				path:'pviews',
				options: { sort: { '_id': -1 } },
					populate: {				//populating "author" of "pviews" of "post".
					path: 'author',
					model: 'User'
					}
				}).populate(				
				{
					path:'author',
					model:'User'
				}); 
		let sharedPosts = await SharedPost.find({}).where('topic').equals(req.params.topic_id).sort({"_id":-1}).populate(				
				{
					path:'author',
					model:'User'
				}).populate(
					{
					path:'pviews',
					options: { sort: { '_id': -1 } },
					populate: {				//populating "author" of "pviews" of "post".
						path: 'author',
						model: 'User'
					}
				}).populate({//nested post population
					path:'shpost',
					populate: [//populating multiple documents
						{
							path:'author',
							model:'User'
						},
						{
							path:'pviews',
							options: { sort: { '_id': -1 } },
							populate: {				//populating "author" of "pviews" of "post".
								path: 'author',
								model: 'User'
								}
						}
					]
				});
		let postObjs = posts.concat(sharedPosts);

		function compareDates(curr, next) {
		    if (curr.time < next.time) {
		        return 1;
		    }
		    if (curr.time > next.time) {
		        return -1;
		    }
		    return 0;
		}

		//the ".sort()" compares each element 
		postObjs.sort(compareDates);
	
		res.render('posts/index', { 
			topic,
			postObjs,
			myPosts,
			myShares,  
			title: 'Posts Index',
			leftvar: 'leftSectMenu' 
		});
	},
	// Posts New
	postNew(req, res, next) {
		res.render('posts/new');
	},
	// Posts Create
	async postCreate(req, res) {
		


		req.body.post.images = [];

		if(req.files){
			for(const file of req.files) {  //images are in req.files
				if(isImage(file.url)){
					req.body.post.images.push({
						url: file.secure_url,
						public_id: file.public_id
					});
				}else if(isVideo(file.url)){
					const {secure_url, public_id} = file;
					req.body.post.video = {
						secure_url,
						public_id
					}
				}else{
					return res.json({err: `Cannot upload invalid file types`});
				}
			}

		}
		const user = await User.findById(req.user._id);

		const topic = await Topic.findById(req.params.topic_id);
		debugger;
		req.body.post.topic = topic._id;

		req.body.post.author = req.user._id;
		let post = new Post(req.body.post);

		user.postXP += 2;

		await post.save();
		topic.posts.push(post);
		await topic.save();

		// adding specific XP to the user
		await user.save();
		const login = await util.promisify(req.login.bind(req));
		await login(user);

		debugger;

		// req.session.success = 'Post created successfully!';
		res.json(post);
		//when post is created of course it will have /POST
		//for sharepost route is different
	},
	// Posts Show
	async postShow(req, res, next) {

		let topic = res.locals.topic;

		let myPosts = res.locals.myPosts;

		let myShares = res.locals.myShares;

		delete res.locals.myShares;
		delete res.locals.myPosts;
		delete res.locals.topic;
		//populating (multiple things at a time)

		let post;
		if(req.params.type === "SHARED_POST"){
			post = await SharedPost.findById(req.params.id).populate(				
				{
					path:'author',
					model:'User'
				}).populate(
					{
					path:'pviews',
					options: { sort: { '_id': -1 } },
					populate: {				//populating "author" of "pviews" of "post".
						path: 'author',
						model: 'User'
					}
				}).populate({//nested post population
					path:'shpost',
					populate: [//populating multiple documents
						{
							path:'author',
							model:'User'
						},
						{
							path:'pviews',
							options: { sort: { '_id': -1 } },
							populate: {				//populating "author" of "pviews" of "post".
								path: 'author',
								model: 'User'
								}
						}
					]
				});
		} else{
			post = await Post.findById(req.params.id).populate({
				path: 'pviews',
				options: { sort: { '_id': -1 } },
				populate: {				//populating "author" of "pviews" of "post".
					path: 'author',
					model: 'User'
				}
			}).populate({
				path: 'author' //populating "author" of "posts"
			});
		}

		// const floorRating = post.calculateAvgRating();
		//making the logged in user accessible everywhere
		const user =  req.user;
		res.render('posts/show', {topic, myPosts, myShares, post, user, leftvar:'leftSectMenu' });
	},
	//Posts Edit
	//async postUpdate(req, res, next) {
  	// find the post by id
  	//let post = await Post.findById(req.params.id);

	// Posts Edit
	async postEdit(req, res, next) {
		//ffuck off the post from res.locals in "index.js(isAuthor)"

		debugger;
		let post;
		if(req.params.type === "SHARED_POST"){
			post = await SharedPost.findById(req.params.id).populate(				
				{
					path:'author',
					model:'User'
				}).populate(
					{
					path:'pviews',
					options: { sort: { '_id': -1 } },
					populate: {				//populating "author" of "pviews" of "post".
						path: 'author',
						model: 'User'
					}
				}).populate({//nested post population
					path:'shpost',
					populate: [//populating multiple documents
						{
							path:'author',
							model:'User'
						},
						{
							path:'pviews',
							options: { sort: { '_id': -1 } },
							populate: {				//populating "author" of "pviews" of "post".
								path: 'author',
								model: 'User'
								}
						}
					]
				});
		} else{
			post = await Post.findById(req.params.id).populate({
				path: 'pviews',
				options: { sort: { '_id': -1 } },
				populate: {				//populating "author" of "pviews" of "post".
					path: 'author',
					model: 'User'
				}
			}).populate({
				path: 'author' //populating "author" of "posts"
			});
		}
		return res.render('posts/edit', {post});
	},
	// Posts Update
	async postUpdate(req, res, next) {
		// find the post by id
		//let post = await Post.findById(req.params.id);

		// pull post from res.locals that code is in "index.js(isAuthor)"
		const { post } = res.locals;

		// check if there's any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {			
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages) {
				// delete images from cloudinary
				await cloudinary.v2.uploader.destroy(public_id);
				// delete image from post.images
				for(const image of post.images) { 
					if(image.public_id === public_id) {
						let index = post.images.indexOf(image);// post.images is an array of images
						post.images.splice(index, 1);
					}
				}
			}
		}
		// check if there are any new images for upload
		if(req.files) {
			// upload images
			for(const file of req.files) {
				// add images to post.images array
				post.images.push({
					url: file.secure_url,
					public_id: file.public_id
				});
			}
		}
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		// save the updated post into the db
		await post.save();                   //thf, It will first "save" Then only "redirect"
		// redirect to show page
		res.json(post);
	},
	// Posts Destroy
	async postDestroy(req, res, next) {
		//let post = await Post.findById(req.params.id);
		const topic = await Topic.findById(req.params.topic_id);
		// pull post from res.locals that code is in "seeds.js(isAuthor)"

		const { post } = res.locals;
		if(post.images && post.images.length>0){
			for(const image of post.images) {
				await cloudinary.v2.uploader.destroy(image.public_id);
			}
		}
		
		//will be an array of posts
		if(req.params.type === 'SHARED_POST'){
			await SharedPost.findByIdAndRemove(post._id);
		}else{
			await Post.findByIdAndRemove(post._id);
		}
		// req.session.success = 'Post deleted successfully!';
		res.json(post);
	},

	async isPostAuthor(req, res, next) {
		const editReqUser = await User.findById(req.params.user_id);
		const loggedUser = req.user;

		if(loggedUser._id.equals(editReqUser._id)) {

			const post = await Post.findById(req.params.own_post_id);

			// post.title = req.body.post.title;
			// post.description = req.body.post.description;
			// save the updated post into the db
			// await post.save();                   //thf, It will first "save" Then only "redirect"
			// redirect to show page
			return res.render('users/ownprofile', {allowedUser:loggedUser, post});
		}
	},
	async getBookmark(req, res, next){//it's route is in index.ejs
		// I m smart instead of searching the posts for bookmarks using .equals I prefer populating the
		//bookmarks 
		const user = await User.findById(req.user._id).populate({
			path: 'bookmarks',
			options: { sort: { '_id': -1 } }
		});

		res.render('users/bookmarks', {user});
	},
	async addBookmark(req, res, next){
		let ajRes;
		const user = req.user;

		let modelObj;
		if( req.params.type === 'SHARED_POST'){
			modelObj = await SharedPost.findById(req.params.id);
		} else {
			modelObj = await Post.findById(req.params.id);
		}
		
		//Prior to recording a user bookmark, we want to check the "user.bookmarks" array to see if a user already liked.
		//The "some()"" method will iterate over the "user.bookmarks" array, calling "equals()" on each element (ObjectId) to see if it matches req.user._id 
		let foundUserBookmark = user.bookmarks.some((bookmark) => {
			return bookmark.equals(modelObj._id);
		});
		console.log(user.bookmarks);
		// if "true"
		if(foundUserBookmark){
		        // user already bookmarked, removing bookmark
		        ajRes = 'removed';
				user.bookmarks.pull(modelObj._id);
		// if false
		} else {
				ajRes = 'added';
			    // adding the new user like
				user.bookmarks.push(modelObj._id);
		}

		await user.save();

		// promsify req.login ["so that login has access to (request object) "]
		const login = await util.promisify(req.login.bind(req));
		// log the user back in with new info
		await login(user);
		// VVVVVVVVVVIMPORTANT  point to remember(the user const can't be used) after logging in
		const loguser = req.user;
		// redirect to /profile with a success flash message
		// req.session.success = 'Bookmarked';
		//making the process easier
		res.json(ajRes);
		
	},
	async addLike(req, res, next){
		const user = await User.findById(req.user._id);

		let modelObj;
		if(req.params.type === 'SHARED_POST'){
			modelObj = await SharedPost.findById(req.params.id);		
		} else{
			modelObj = await Post.findById(req.params.id);			
		}

		//Prior to recording a user like, we want to check the modelObj.likes array to see if a user already liked.
		//The some() method will iterate over the modelObj.likes array, calling equals() on each element (ObjectId) to see if it matches req.user._id 
		let foundUserLike = modelObj.likes.some((like) => {
			return like.equals(req.user._id);
							//user already liked
		});

		if (foundUserLike) {
			// user already liked, removing like
			user.likeXP -= 1;
			modelObj.likes.pull(req.user._id);
		} else {
			// adding the new user like
			user.likeXP += 1;
			modelObj.likes.push(req.user._id);
		}
		
		await modelObj.save();

		// adding specific XP to the user
		await user.save();
		const login = await util.promisify(req.login.bind(req));
		await login(user);

		res.json(modelObj);
		
	},
	async getLikes(req, res){
		const topic = await Topic.findById(req.params.topic_id);

		let post;//post is the same like modelObjs
		if(req.params.type === 'SHARED_POST'){
			post = await SharedPost.findById(req.params.id).populate({
				path: 'likes',
				options: {sort: {'_id': -1}}
			});
		} else {
			post = await Post.findById(req.params.id).populate({
				path: 'likes',
				options: {sort: {'_id': -1}}
			});			
		}

		return res.render('posts/likes', { leftvar:'leftSectMenu', topic, post});
	},
	async getSharePage(req, res){

		let topic = res.locals.topic;

		let myPosts = res.locals.myPosts;

		let myShares = res.locals.myShares;

		delete res.locals.myShares;
		delete res.locals.myPosts;
		delete res.locals.topic;

		const pToBeShared = await Post.findById(req.params.id).populate({
			path: 'author',
			model: 'User'
		});
		const user =  req.user;

		res.render('posts/newshare.ejs', {topic, myShares, myPosts, post:pToBeShared, user, leftvar:'leftSectMenu'});

	},
	async sharedPostCreate(req, res){
		const user = await User.findById(req.user._id);

		const topic = await Topic.findById(req.params.topic_id);
		
		const pToBeShared = await Post.findById(req.params.id);

		console.log(req.user._id);
		debugger;

		user.shareXP += 2;

		//don't save it directly from the params what if that topic doesn't exist
		req.body.sharedpost.topic = topic._id;
		req.body.sharedpost.author = req.user._id;
		req.body.sharedpost.shpost = pToBeShared._id;

		let shpost = new SharedPost(req.body.sharedpost);
		await shpost.save();
		topic.posts.push(shpost);
		await topic.save();

		// adding specific XP to the user
		await user.save();
		const login = await util.promisify(req.login.bind(req));
		await login(user);

		req.session.success = 'Post shared successfully !';
		res.redirect(`/topics/${topic._id}/posts`);

		// const topic = await Topic.findById(req.params.topic_id);
		// req.body.post.topic = topic._id;

		// req.body.post.author = req.user._id;
		// let post = new Post(req.body.post);

		// await post.save();
		// topic.posts.push(post);
		// await topic.save();

	}


}

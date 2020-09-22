const Topic = require('../models/topic');
const Hub = require('../models/hub');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');
const util = require('util');

module.exports = {
	
	async topicIndex(req, res, next){
		try{

		var catIdArray = [];
		var categs = await Hub.find({},{_id:1});
		for(let categ of categs){
			catIdArray.push(categ._id);
		}
		var topics = [];

		for(let id of catIdArray){
			debugger;
			const someTopics = await Topic.find( { "hub" : { $in : id } } ).sort({'_id': -1}).populate({path:'hub',model:'Hub'}).limit(10);
		
			
			for(let topic of someTopics){
				topics.push(topic);
			}
		}

		var catToBeFound = await Hub.findOne({'title': req.body.hub_title});
		var topics = [];

		var categs = await Hub.find({});

		for(let categ of categs){
			debugger;

			if(catToBeFound.title === categ.title){
				const someTopics = await Topic.find( { "hub" : { $in : catToBeFound._id } } ).sort({'_id': -1}).populate({path:'hub',model:'Hub'}).limit(10);
			
				
				for(let topic of someTopics){
				debugger;

					topics.push(topic);
				}
			}
		}

		
		debugger;
		//Doing all this to only return fixed no of objs in the array so that in the front-end
		//It won't have to iterate over thousands and thousands of docs each time.
		res.render('topics/index', { 
			topics, 
			title: 'All Topics',
			leftvar:'leftSectMenu',
			leftMenuHigh:req.body.hub_title.toLowerCase() 
		});

		}catch(e){
			req.session.error = 'Please do not tamper with the inputs'
			res.redirect('back');
		}

	},

	async topicCatAll(req, res){

		//pass the dbQuery instead of {}

		let topics = await Topic.paginate({}, {
			page: req.query.page || 1,
			limit: 12,
			sort: '-_id',
			populate: {
					path:'hub',
					model:'Hub'
				}
		});

		
		topics.page = Number(topics.page);
		res.render('topics/index', { 
			topics, 
			title: "Hub's All Topics" 
		});		
	},

	async topicNew(req, res){
		res.render('topics/new', {title: 'Create Topic'});
	},

	async topicCreate(req, res){
	
	debugger;

	if((req.body.topic.title.length<=35) && (req.body.topic.tagline.length<=55)){
		//ajax is doing some things to that array that's why need to do this stuff
		//converting array to contain unique elements
		//single element should not be converted to single letters so
		//only array should be converted to letters

		// if(Array.isArray(req.body.tags)){
			// var uniqueArr = [];

			// for(i=0; i < req.body.tags.length; i++){
			// 	if(uniqueArr.indexOf(req.body.tags[i]) === -1) {
			// 		uniqueArr.push(req.body.tags[i]);
			// 	}
			// }
			// req.body.tags = uniqueArr;
			//creating array elements where it encounters 
			let tags = req.body.tags;
			req.body.tags = [];
			let val = tags.split(',');
			debugger;
			val.forEach(function(val){
				req.body.tags.push(val);
			});
			// req.body.tags = req.body.tags.split(",");
		// }

		req.body.topic.logo = [];
		for(const file of req.files) {  //images are in req.files
			req.body.topic.logo.push({
				url: file.secure_url,
				public_id: file.public_id
			});
		}
		req.body.topic.hub = req.body.topic.hub.toLowerCase();
		const categ = await Hub.findOne({'title': req.body.topic.hub});
								//findOne is imp for it to give an object
		req.body.topic.hub = categ._id;
		req.body.topic.hub.title = categ.title;
		debugger;

		//putting tags in topic.tags
		req.body.topic.tags = req.body.tags;

		req.body.topic.owner = req.user._id;
		let topic = new Topic(req.body.topic);
		const newTopic = await topic.save();


		let user = await User.findById(req.user.id);
		debugger;
		user.myTopics.actMyTopics.push(newTopic._id);

		await user.save();
		const login = await util.promisify(req.login.bind(req));
		await login(user);

		req.session.success = 'Topic created successfully!';
	   	//return res.send({redirect:`/topics/${topic._id}`});

	   	return res.send({redirect:`/topics`});
		//when post is created of course it will have /POST
		//for sharepost route is different

	}else {

		req.session.error = 'Plz do not exceed the characters length';
		res.redirect('back');

	}
				
	},

	async topicShow(req, res){
		var topic = await Topic.findById(req.params.id);
		if(req.creator === true){
			res.render('topics/manageTopic', {topic});
		}else if(req.creator === false){
			//Otherwise redirect to that route of /topics/:id/posts
		}else{//for some reason
			req.session.error = 'U cannot go to this page'
			res.redirect('back');
		}

	},

	async topicEdit(req, res){

	},
	
	async topicUpdate(req, res){

	},

	async topicDestroy(req, res){
		//while deleting the topic don't forget to remove *topics from user.myTopics.actMyTopics*
		
	},

	async followTopic(req, res){

		try{

		const topicToBeFollowed = await Topic.findById(req.params.topic_id);

		const user = req.user;

		let foundFollower = topicToBeFollowed.followers.some((follower) => {
			return follower.equals(user._id);
		});

		if(foundFollower){
		    // user already bookmarked, removing bookmark
		    ajRes = 'removed';
			topicToBeFollowed.followers.pull(user._id);
			user.followingTopics.actFollowingTopics.pull(topicToBeFollowed._id);
		// if false
		} else {
				ajRes = 'added';
			    // adding the new user like
				topicToBeFollowed.followers.push(user._id);
				user.followingTopics.actFollowingTopics.push(topicToBeFollowed._id);

		}

		await topicToBeFollowed.save();
		await user.save();

		// promsify req.login ["so that login has access to (request object) "]
		const login = await util.promisify(req.login.bind(req));
		// log the user back in with new info
		await login(user);
		// debugger;

		res.json(ajRes);

		}catch(e){
			res.json({err:'Oops something went wrong'});
		}

	}

}
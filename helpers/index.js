const Pview = require('../models/pview');
const User = require('../models/user');
const Post = require('../models/post');
const SharedPost = require('../models/share');
const Topic  = require('../models/topic');
const { cloudinary } = require('../cloudinary/index');
const util = require('util');

const helpers = {
    asyncErrorHandler: (fn) =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                        .catch(next);
        },
    ispviewAuthor: async (req, res, next) => {
        let pview = await Pview.findById(req.params.pview_id);
        if(pview.author.equals(req.user._id)) {
            return next();
        }else{
            res.json({err: `Access denied to perform action on other's comment`});
        }
    },    
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) { //is logged in
            res.locals.user = req.user; //passing user in all views
            return next();
        }
        req.session.error = 'You need to be logged in to do that!';
        req.session.redirectTo = req.originalUrl;	// "URposn" => "/login" => "URposn"
        res.redirect('/login');
    },     //checking for (first time) if user is allowed. Second Time checking in controllers
    isProfileOwner: (req, res, next) => { //if the user uses curl
		let  user  = req.user;//find user which wants to edit (which is logged in)
		console.log(user);
		if (user._id.equals(req.params.user_id)) { //find the user id whose account is going to be edited
            return next();                      // /profile/:user_id/edit
		}   
		
        req.session.error = "You can't edit others profile";
		res.redirect('back');
	},
	isAuthor: async (req, res, next) => {
    try{

        let post;
        if(req.params.type==='SHARED_POST'){
          post = await SharedPost.findById(req.params.id).populate(             
                {
                    path:'author',
                    model:'User'
                }).populate(
                    {
                    path:'pviews',
                    options: { sort: { '_id': -1 } },
                    populate: {             //populating "author" of "pviews" of "post".
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
                            populate: {             //populating "author" of "pviews" of "post".
                                path: 'author',
                                model: 'User'
                                }
                        }
                    ]
                });

        } else {
          post = await Post.findById(req.params.id).populate(
                {
                path:'pviews',
                options: { sort: { '_id': -1 } },
                    populate: {             //populating "author" of "pviews" of "post".
                    path: 'author',
                    model: 'User'
                    }
                }).populate(                
                {
                    path:'author',
                    model:'User'
                });

        }
		if (post.author.equals(req.user._id)) {
			res.locals.post = post;
			next();
		}else{
            res.json({err: `Sorry you don't have permission to edit this post`});
        }


    }catch(err){
        

        req.session.error = "Access Denied";
        res.redirect('back');
    }

    },
    removePostFromTopic: async(req, res, next)=>{
        //Removing the posts form the array in the topic
            await Topic.findByIdAndUpdate(req.params.topic_id,{ //removing from the posts array 
                $pull: { posts: req.params.id }
            });

            next();
    },
    isPostAuthor: async (req, res, next) => {
        if(req.params.type === 'SHARED_POST'){
    		let post = await SharedPost.findById(req.params.id);
    		console.log(post);
    		if (post.author.equals(req.user._id)) {
    			return next();
    		}
        } else {
            let post = await Post.findById(req.params.id);
            console.log(post);
            if (post.author.equals(req.user._id)) {
                return next();
            }            
        }
		req.session.error = 'Access denied!';
		res.redirect('back');
	},
    isValidPassword: async (req, res, next) => {
        //validating user with their "username" & "corresponding password"
        const { user } = await User.authenticate()(req.user.username, req.body.currentPassword)
        if(user) {                  //if user exists (true)
            // add user to res.locals
            res.locals.user = user;
            // go to next helpers
            next();
        } else {
            helpers.deleteProfileImage(req);
            // flash an error
            req.session.error = 'Incorrect Current Password!';
            // short circuit the route helpers and redirect to /profile
            return res.redirect('/profile');
        }
    },
    changePassword: async (req, res, next) => {
        // destructure new password values from req.body object
        const { 
            newPassword,
            passwordConfirmation
        } = req.body;

        if (newPassword && !passwordConfirmation) {
            helpers.deleteProfileImage(req);
            req.session.error = 'Missing password confirmation!';
            return res.redirect('/profile');
        }
        // check if new password values exist (that is user is changing the password)
        else if (newPassword && passwordConfirmation) {
            // destructure user from res.locals(which was assigned in isValidPassword)
            const { user } = res.locals;
            // check if new passwords match
            if (newPassword === passwordConfirmation) {  //checking 3rd time ( for 3rd time checking in backend side)
                // set new password on user object
                await user.setPassword(newPassword);
                // go to next helpers
                next();
            } else {
                helpers.deleteProfileImage(req);
                // flash error
                req.session.error = 'New passwords must match!';
                // short circuit the route helpers and redirect to /profile
                return res.redirect(`/profile/${req.user._id}`);
            }
        } else {
            // go to next helpers
            next();
        }
    },
    deleteProfileImage: async (req) => {
        if (req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);
    },
    cantreshareshare: (req, res, next) => {
        
        if(req.params.type === 'SHARED_POST'){
            req.session.error = 'Cannot reshare already shared post';
            return res.redirect('back');
        }else{
            return next();
        }
    },//order of these function in routes is very imp
    eligibleForShare: async (req, res, next) => {

        const pToBeShared = await Post.findById(req.params.id);

        //if the user is trying to share his own post
        console.log(pToBeShared);
        // debugger;
        if(pToBeShared.author.equals(req.user._id)){
            req.session.error = 'You cannot share your own post';
            return res.redirect('back');
        }else{
            return next();
        }

    },
    followOthersOnly: async (req, res, next) => {
        const followRequestUser = req.user;
        const otherUser = req.params.user_to_be_followed;

        if(followRequestUser._id === otherUser){
            return res.json({err: `You cannot follow yourself`});
        }else{
            return next();
        }
    },
    reducePostSharePoints: async (req, res, next) => {

        const user = await User.findById(req.user._id);

        debugger;
        if(req.params.type === 'SHARED_POST'){
            user.shareXP -= 2;
        }else{
            user.postXP -= 2;
        }

        await user.save();
        const login = await util.promisify(req.login.bind(req));
        await login(user);

        return next();
    }

 }

module.exports = helpers;

//async "arrow function" do not require the keyword "function"
//async normal function do require the keyword "function"
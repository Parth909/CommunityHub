
const User = require('../models/user');
const Post = require('../models/post');
const SharedPost = require('../models/share');
const Topic = require('../models/topic');
const passport = require('passport');
const util = require('util');  //already included in node runtime
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../helpers');
const crypto = require('crypto');  //already included in node
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  // GET /
  async landingPage(req, res, next) {
	res.redirect('/login');
  },
  // GET /register
  getRegister(req, res, next) {
    res.render('register', {title: 'Register Page', username: '', email: ''});
                                          //using these to prefill the fields after error occurence
  },
  getRegister2(req, res, next){
  		res.render('register2', {title: 'Register Page' , currentUser:req.user});
  },
  // POST /register
  async postRegister(req, res, next) {
    try {


    	if(req.body.confirm_password === req.body.password){

	    	const user = await User.register(new User(req.body), req.body.password);// passing data & passing password sepetately
	        req.login(user, function(err) { //logging the user in 
	          if(err) return next(err);
	          req.session.success =  `Welcome to Unifiq  ${user.username} !`;
	          res.redirect('/register2');
	        }); 

    	}else{
    		req.session.error =  `Password don't match`;
	        res.redirect('/register');
    	}
		
    } catch(err) {

      deleteProfileImage(req); //deleting  previous image
      const {username, email} = req.body;
      let error = err.message;
      if(error.includes('duplicate') && error.includes('index: email_1 dup key')) {
        error = 'A User with given email is already registered'
        //setting error to more readable form by users.
      }
      res.render('register', {title: 'Register', username, email, error}); //again render register page with prefilled data
    
    }

  },
  async postRegister2(req, res, next){

  		const user = await User.findById(req.params.user_id);
        //for image
        //If file exists (file will not be in the req.body as for uploading we use multipart form-data)
		if (req.file) { 
			const { secure_url, public_id } = req.file;
			req.body.profimage = {
				secure_url,
				public_id
			}
			user.profimage = req.body.profimage;
		}

		debugger;

		if(req.body.status) user.status = req.body.status;
		if(req.body.nickname) user.nickname = req.body.nickname;


		await user.save();

		const login = await util.promisify(req.login.bind(req));
		// log the user back in with new info
		await login(user);

		res.redirect('/topics');

  },
  //GET /login
  getLogin(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/');  //already logged in
    //from views/post/show.ejs      //if req.query.returnTo('U r coming from somewhere') exists then res.session.redirectTo = address of from where U r comings
    if(req.query.returnTo) res.session.redirectTo = req.headers.referer;
    // The Referer request header contains the address of the previous web page from which a link to
    res.render('login', {title: 'Login Page'});
  },
  //POST /login
  async postLogin(req, res, next) {
    const {username, password} = req.body;
    const {user, error} = await User.authenticate()(username, password);
    if(!user && error) {
      return next(error);
    }//otherwise

    req.login(user, function(err) {
			if (err) return next(err);
			req.session.success = `Welcome back, ${username} !`;
			// const redirectUrl = req.session.redirectTo || '/';
			// delete req.session.redirectTo;
			// res.redirect(redirectUrl);
			res.redirect('/topics');
		});
  },
  // GET /logout
	getLogout(req, res, next) {
    req.logout();
    req.session.success = 'Logged Out successfully';
    res.redirect('/');
  },
  async getProfile(req, res, next) { //for seeing others profile
  	
	let user = await User.findById(req.params.user_id).populate(
	{
			path:'followingTopics.actFollowingTopics',
			model:'Topic'
	}).populate(
	{
		
			path:'myTopics.actMyTopics',
			model:'Topic'
		
	});

	// let user = await User.findById(req.params.user_id).select('').populate({})

	debugger;

			let posts = await Post.find({}).where('author').equals(user.id).sort({"_id":-1}).populate(
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
		let sharedPosts = await SharedPost.find({}).where('author').equals(user.id).sort({"_id":-1}).populate(				
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
	currentUser = req.user;

	if (user._id.equals(req.user._id)) { // clicked user = logged user

		return res.render('users/ownProfile', { 
			user,
			postObjs,  
			title: 'Posts Index',
			leftvar: 'leftSectMenu',
			currentUser 
		});


		//return res.render('users/ownProfile', {user, posts, currentUser}); //ownProfile (page)
	}
	
		return res.render('users/othersProfile', {
			user, 
			postObjs,  
			title: 'Posts Index',
			leftvar: 'leftSectMenu',
			currentUser 
		});

	//return res.render('users/othersProfile', {user, posts, currentUser}); //othersProfile (page)

  },
  async getEditProfile(req, res, next) {
	let user = await User.findById(req.params.user_id); //find user by id in route (when user clicks on other users in "posts/comments/likes....")
	console.log(user);
	if (user._id.equals(req.user._id)) { // clicked user = logged user
		return res.render('users/editProfile', {user}); //ownProfile (page)
	}
	
	return res.redirect('back'); //othersProfile (page)

    // const { user } = req; //user is in req (req.user))
    //const posts = await Post.find().where('author').equals(user.id).limit(10).exec();
    // res.render('profile', { user });
  },
  async updateProfile(req, res, next) {
		// destructure username and email from req.body (form)
		console.log(req.files.profimage[0].secure_url);
		const {
			username,
			email
		} = req.body;
		// destructure user object from res.locals [which was added before in isValidPassword(middleware)]
		const { user } = res.locals;
		// check if username or email needs to be updated for saving in db.
		if (username) user.username = username;
		if (email) user.email = email;
		// Images
		if (req.files.profimage[0]) { //if new(image to be uploaded) image exists

		if (user.profimage.public_id) await cloudinary.v2.uploader.destroy(user.profimage.public_id); //delete image if it already exists
		const { secure_url, public_id } = req.files.profimage[0];
		user.profimage = { secure_url, public_id }; //adding new image before saving

		}

		if (req.files.backimage[0]) { //if new(image to be uploaded) image exists

			if (user.backimage.public_id) await cloudinary.v2.uploader.destroy(user.backimage.public_id); //delete image if it already exists
			const { secure_url, public_id } = req.files.backimage[0];
			user.backimage = { secure_url, public_id }; //adding new image before saving
	
		}

		// save the updated user to the database
		await user.save();

		// promsify req.login ["so that login has access to (request object) "]
		const login = await util.promisify(req.login.bind(req));
		// log the user back in with new info
		await login(user);
		// VVVVVVVVVVIMPORTANT  point to remember(the user const can't be used) after logging in
		const loguser = req.user;
		// redirect to /profile with a success flash message
		req.session.success = 'Profile successfully updated!';
		return res.redirect(`/profile/${loguser._id}`);
	},
  getForgotPw(req, res, next) {
		res.render('users/forgot');
  },
  async putForgotPw(req, res, next) {
		const token = await crypto.randomBytes(20).toString('hex'); //generating some random token
	
		const user = await User.findOne({ email: req.body.email })
		if (!user) {
			req.session.error = 'No account with that email address exists.';
		  return res.redirect('/forgot-password');
		}

		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000; //expires after 1 hour

  		await user.save();
  

  		const msg = {
    	to: user.email,
    	from: 'Surf Shop Admin <your@email.com>',
    	subject: 'Surf Shop - Forgot Password / Reset',
    	text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
				Please click on the following link, or copy and paste it into your browser to complete the process:
				http://${req.headers.host}/reset/${token}
				If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/				/g, ''), //replacing that amnt of space with empty string(no space)
        //token ADDED IN as PARAMETER
        //html: '<strong> Easy to do anywhere, even with nodejs </strong>' Also can use above template string here
  		};

  		await sgMail.send(msg);

  		req.session.success = `An e-mail has been sent to ${user.email} with further instructions.`;
  		res.redirect('/forgot-password');
  },
  async getReset(req, res, next) {
    const { token } = req.params; //req.params.token
            //find user which has( resetPasswordToken = token & resetPasswordExpires >  $gt: Date.now()      )
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }) //($gt) is mongodb's greaterthan operator
    if (!user) {												//resetPasswordExpires(we set that in uppercontroller for +1 hour) > Date.now() 
      req.session.error = 'Password reset token is invalid or has expired.';
      return res.redirect('/forgot-password');
    }
    res.render('users/reset', { token });
  },
  async putReset(req, res, next) {
		const { token } = req.params; //req.params.token
		const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
	
		if (!user) {
	 	req.session.error = 'Password reset token is invalid or has expired.';
	 	return res.redirect(`/reset/${ token }`); //again will get user the form
		}

		if(req.body.password === req.body.confirm) {
			await user.setPassword(req.body.password); //setting password
			user.resetPasswordToken = null;
			user.resetPasswordExpires = null;
			await user.save();
			const login = util.promisify(req.login.bind(req)); //req.login() is given to us 
			// by passport but [req.login() takes a callback as an argument] but we use [Async Await] 
			//by using [util] we [convert the callback to a promise]
			await login(user);
		} else {
			req.session.error = 'Passwords do not match.';
			return res.redirect(`/reset/${ token }`);
		}

  		const msg = {
    		to: user.email,
    		from: 'Surf Shop Admin <your@email.com>',
    		subject: 'Surf Shop - Password Changed',
    		text: `Hello,
	  		This email is to confirm that the password for your account has just been changed.
	  		If you did not make this change, please hit reply and notify us at once.`.replace(/	  		/g, '')
  		};
  
  		await sgMail.send(msg);

  		req.session.success = 'Password successfully updated!';
  		res.redirect('/');
	},
	async getBio(req, res) {
		let user = await User.findById(req.params.user_id); //find user by id in route (when user clicks on other users in "posts/comments/likes....")
		console.log(user);
		if (user._id.equals(req.user._id)) { // clicked user = logged user
			return res.render('users/editbio', {user}); //ownProfile (page)
		}
		
		return res.redirect('back'); 
	
	  },
	async updateBio(req, res) {
		// destructure username and email from req.body (form)
		console.log(req.body.user);
		const {
			status,
			nickname,
			site,
			bornday,
			bornmonth,
			bornyear,
			location,
		} = req.body.user;
		// destructure user object from res.locals [which was added before in isValidPassword(middleware)]
		const { user } = res.locals;
		// check if username or email needs to be updated for saving in db.
		if (status) user.status = status;
		if (nickname) user.nickname = nickname;
		if (site) user.site = site;
		if (bornday) user.bornday = Number(bornday);
		if (bornmonth) user.bornmonth = bornmonth;
		if (bornyear) user.bornyear = Number(bornyear);
		if (location) user.location = location;
		// save the updated user to the database
		await user.save();
		// redirect to /profile with a success flash message
		req.session.success = 'Bio successfully updated!';
		return res.redirect(`/profile/${user._id}`);
	},

	getOptionsPage(req, res) {
		res.render('index/options');
	},

	getAdvOptionsPage(req, res) {
		res.render('index/advoptions');
	},

	//ALWAYS AT THE LAST
	getDefaultPage(req, res) {
		res.render('invalidpage', {user:req.user});
	},

	async followUser(req, res){
		debugger;
		const userToBeFollowed = await User.findById(req.params.user_to_be_followed);

		const user = req.user;

		let foundFollower = userToBeFollowed.followers.actFollowers.some((follower) => {
			return follower.equals(user._id);
		});

		if(foundFollower){
		    // user already bookmarked, removing bookmark
		    ajRes = 'removed';
			userToBeFollowed.followers.actFollowers.pull(user._id);
		// if false
		} else {
				ajRes = 'added';
			    // adding the new user like
				userToBeFollowed.followers.actFollowers.push(user._id);
		}

		await userToBeFollowed.save();
		debugger;

		res.json(ajRes);
	},
    async sortFollowingTopics(req, res){
    	try{
	    	const user = await User.findById(req.params.user_id).populate(
	    	{
	    		path: 'followingTopics.actFollowingTopics',
	    		model:'Topic'
	    	}).populate(
	    	{
	    		path:'myTopics.actMyTopics',
	    		model:'Topic'
	    	});

	        if(req.params.sort_method === 'A-Z'){
	            //do something
	            res.json(user);
	        }else if(req.params.sort_method === 'RecentlyAdded'){
	            //do something
	            res.json(user);
	        }else if(req.params.sort_method === 'MoreFollowingTopics'){
	        	res.json(user);
	        }else if(req.params.sort_method === 'MoreMyTopics'){
	        	res.json(user);
	        }
	          		
    	}catch(e){
        	res.json({err:`Oops something went wrong`});
    	}
        
    },
    async getSpecficSect(req, res){

    		let user = await User.findById(req.params.user_id).populate(
	{
		path:'followingTopics.actFollowingTopics',
		model:'Topic'
	}).populate(
	{
		path:'myTopics.actMyTopics',
		model:'Topic'
	}); //find user by id in route (when user clicks on other users in "posts/comments/likes....")

		let posts = await Post.find({}).where('author').equals(user.id).sort({"_id":-1}).populate(
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
		let sharedPosts = await SharedPost.find({}).where('author').equals(user.id).sort({"_id":-1}).populate(				
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
	currentUser = req.user;

	if (user._id.equals(req.user._id)) { // clicked user = logged user

		return res.render('users/specific-profile-sect', { 
			user,
			postObjs,  
			title: 'Posts Index',
			leftvar: 'leftSectMenu',
			currentUser 
		});


		//return res.render('users/ownProfile', {user, posts, currentUser}); //ownProfile (page)
	}
	
		return res.render('users/specific-profile-sect', {
			user, 
			postObjs,  
			title: 'Posts Index',
			leftvar: 'leftSectMenu',
			currentUser 
		});

	//return res.render('users/othersProfile', {

    }

}

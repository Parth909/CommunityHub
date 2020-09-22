//different route for topics is required for things like
//creating,editing,deleting and doing other things solely on topics
const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
//, storage2
const { storage1, storage2 } = require('../cloudinary');
const upload1 = multer({ storage:storage1 });
const upload2 = multer({ storage:storage2 });

const { 
	asyncErrorHandler, 
	isLoggedIn, 
	isAuthor, 
	isTopicAuthor,
	isPostAuthor,
	eligibleForShare, 
	cantreshareshare,
	removePostFromTopic,
	reducePostSharePoints
} = require('../helpers');

const { 
	postIndex,
	postNew,
  	postCreate,
  	postShow,
  	postEdit,
  	postUpdate,
	postDestroy,
	addBookmark,
	addLike,
	getLikes,
	getSharePage,
	sharedPostCreate
} = require('../controllers/posts');

// For the topics

const { 
	isTopicCreator,
	findHub,
	topicContent
} = require('../helpers/topics.js');

const { 
	topicIndex,
	topicCatAll,
	topicNew,
	topicCreate,
	topicShow,
	topicEdit,
	topicUpdate,
	topicDestroy,
	followTopic
} = require('../controllers/topics');

/* GET topics index /topics/ */ //For showing all topics
router.get('/', isLoggedIn, findHub, asyncErrorHandler(topicIndex));

/* GET topics index /topics/new */ //Page for creating new topic
router.get('/new', isLoggedIn, topicNew);

/* POST topics create /topics/ */ //For saving the topic
router.post('/', isLoggedIn, upload1.array('topicImage', 4), asyncErrorHandler(topicCreate));

/* GET topics show /topics/:id */ //This route is reserved for the one who owns the topic
//This route can be further used for adding admin privileges / managing channel
router.get('/:topic_id', isLoggedIn, asyncErrorHandler(isTopicCreator) ,asyncErrorHandler(topicShow));

/* GET topics edit /posts/:id/edit *///there is going to be only one topic image 
//the back images will be provided by us (so that user  doesn't mess up the look)
router.get('/:topic_id/edit', isLoggedIn, asyncErrorHandler(isTopicAuthor), topicEdit);

/* PUT posts update /posts/:id */
router.put('/:topic_id', isLoggedIn, asyncErrorHandler(isTopicAuthor), upload1.array('topicImage', 1), asyncErrorHandler(topicUpdate));

/* DELETE posts destroy /posts/:id */
router.delete('/:topic_id', isLoggedIn, asyncErrorHandler(isTopicAuthor), asyncErrorHandler(topicDestroy));

router.post('/:topic_id/followtopic', isLoggedIn, asyncErrorHandler(followTopic));

//------------------------ Functionality routes for the posts ---------------------------


/* /type is used bcz we are using sharedposts as well */
// wherever there is is author type is used so that content can be populated and manipulated accordingly


/* GET posts index /:topic/posts */
router.get('/:topic_id/posts', isLoggedIn, asyncErrorHandler(topicContent), asyncErrorHandler(postIndex));

/* GET posts new /:topic/posts/new */
router.get('/:topic_id/posts/new', isLoggedIn, postNew);

/* POST posts create /:topic/posts */
// ,upload2.single('postVideo'),
router.post('/:topic_id/posts', isLoggedIn, upload1.array('postImages', 4), asyncErrorHandler(postCreate));


/* POST posts bookmark /:topic/posts/:id/bookmark */
router.post('/:topic_id/posts/:id/bookmark/:type', isLoggedIn, asyncErrorHandler(addBookmark));

/* Get posts bookmark /bookmarks in index.ejs*/

/* POST posts likes /:topic/posts/:id/like */ //remember where ever posts are there they will always be like /posts/:id
router.post('/:topic_id/posts/:id/like/:type', isLoggedIn, asyncErrorHandler(addLike));

/* GET posts likes /:topic/posts/:id/like */ //remember whereever posts are there they will always be like /posts/:id
router.get('/:topic_id/posts/:id/likes/:type', isLoggedIn, asyncErrorHandler(topicContent), asyncErrorHandler(getLikes));

//for SHARES there is no need of /:type but used to block the user from resharing share
/*GET sharedposts /:topic/posts/:id/share */ //id of the post to be shared
router.get('/:topic_id/posts/:id/share/:type', isLoggedIn, cantreshareshare, asyncErrorHandler(eligibleForShare), asyncErrorHandler(topicContent), asyncErrorHandler(getSharePage));

/*POST sharedposts /:topic/posts/:id/share */ //this id is of the post to be shared is got back,no need of id for creating post as it will be created now
router.post('/:topic_id/posts/:id/share/:type', isLoggedIn, cantreshareshare, asyncErrorHandler(eligibleForShare), asyncErrorHandler(sharedPostCreate));


/* GET posts edit /:topic/posts/:id/edit *///isAuthor is there so /:type is used
router.get('/:topic_id/posts/:id/edit/:type', isLoggedIn, asyncErrorHandler(isPostAuthor), asyncErrorHandler(postEdit));


/* GET posts show /:topic/posts/:id */
router.get('/:topic_id/posts/:id/:type', isLoggedIn, asyncErrorHandler(topicContent), asyncErrorHandler(postShow));

/* PUT posts update /:topic/posts/:id */
router.put('/:topic_id/posts/:id/:type', isLoggedIn, asyncErrorHandler(isAuthor), upload1.array('images', 4), asyncErrorHandler(postUpdate));

/* DELETE posts destroy /:topic/posts/:id */
router.delete('/:topic_id/posts/:id/:type', isLoggedIn, asyncErrorHandler(isAuthor),asyncErrorHandler(removePostFromTopic), asyncErrorHandler(reducePostSharePoints), asyncErrorHandler(postDestroy));

module.exports = router;
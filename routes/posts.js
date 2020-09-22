const express = require('express');
const Post = require('../models/post');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
//, storage2
const { storage1, storage2 } = require('../cloudinary');
const upload2 = multer({ storage:storage2 });
const upload1 = multer({ storage:storage1 });

const { 
	asyncErrorHandler, 
	isLoggedIn, 
	isAuthor, 
	isPostAuthor,
	eligibleForShare, 
	cantreshareshare
} = require('../helpers/index');
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

/* /type is used bcz we are using sharedposts as well */
// wherever there is is author type is used so that content can be populated and manipulated accordingly


/* GET posts index /:topic/posts */
router.get('/', isLoggedIn, asyncErrorHandler(postIndex));

/* GET posts new /:topic/posts/new */
router.get('/new', isLoggedIn, postNew);

/* POST posts create /:topic/posts */
//    upload1.array('postImages', 4), upload2.single('postVideo'),
router.post('/', isLoggedIn, upload1.array('postImages', 4), asyncErrorHandler(postCreate));


/* POST posts bookmark /:topic/posts/:id/bookmark */
router.post('/:id/bookmark/:type', isLoggedIn, asyncErrorHandler(addBookmark));

/* Get posts bookmark /bookmarks in index.ejs*/

/* POST posts likes /:topic/posts/:id/like */ //remember where ever posts are there they will always be like /posts/:id
router.post('/:id/like/:type', isLoggedIn, asyncErrorHandler(addLike));

/* GET posts likes /:topic/posts/:id/like */ //remember whereever posts are there they will always be like /posts/:id
router.get('/:id/likes/:type', isLoggedIn, asyncErrorHandler(getLikes));

//for SHARES there is no need of /:type but used to block the user from resharing share
/*GET sharedposts /:topic/posts/:id/share */ //id of the post to be shared
router.get('/:id/share/:type', isLoggedIn, cantreshareshare, asyncErrorHandler(eligibleForShare), asyncErrorHandler(getSharePage));

/*POST sharedposts /:topic/posts/:id/share */ //this id is of the post to be shared is got back,no need of id for creating post as it will be created now
router.post('/:id/share/:type', isLoggedIn, cantreshareshare, asyncErrorHandler(eligibleForShare), asyncErrorHandler(sharedPostCreate));


/* GET posts edit /:topic/posts/:id/edit *///isAuthor is there so /:type is used
router.get('/:id/edit/:type', isLoggedIn, asyncErrorHandler(isPostAuthor), asyncErrorHandler(postEdit));


/* GET posts show /:topic/posts/:id */
router.get('/:id/:type', isLoggedIn, asyncErrorHandler(postShow));

/* PUT posts update /:topic/posts/:id */
router.put('/:id/:type', isLoggedIn, asyncErrorHandler(isAuthor), upload1.array('images', 4), asyncErrorHandler(postUpdate));

/* DELETE posts destroy /:topic/posts/:id */
router.delete('/:id/:type', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy));

module.exports = router;

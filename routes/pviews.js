const express = require('express');
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler,isLoggedIn, ispviewAuthor } = require('../helpers');
const { 
	pviewCreate,
	pviewUpdate,
	pviewDestroy
} = require('../controllers/pviews');

/* pview pviews create /topics/:topic_id/posts/:id/pviews */
router.post('/:type', isLoggedIn, asyncErrorHandler(pviewCreate));

/* PUT pviews update /posts/:id/pviews/:pview_id *///No need of type here bcz updating in the pview model
router.put('/:pview_id', ispviewAuthor, asyncErrorHandler(pviewUpdate));

/* DELETE pviews destroy /posts/:id/pviews/:pview_id/:type */
router.delete('/:pview_id/:type', ispviewAuthor, asyncErrorHandler(pviewDestroy));


module.exports = router;

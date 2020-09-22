const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const { storage1 } = require('../cloudinary/index');
const upload1 = multer({ storage:storage1 });
const { 
    landingPage,
    getRegister,
    postRegister,
    getRegister2,
    postRegister2,
    getLogin,
    postLogin,
    getLogout,
    getProfile,//for seeing profiles
    getForgotPw,
    putForgotPw,
    getReset,
    putReset,
    getBio,
    updateBio,
    getEditProfile,
    updateProfile,
    getOptionsPage,
    getAdvOptionsPage,
    getDefaultPage,
    followUser,
    sortFollowingTopics,
    getSpecficSect
} = require('../controllers/index');
const {
	getBookmark
} = require('../controllers/posts');
const { 
    asyncErrorHandler, 
    isLoggedIn, 
    isValidPassword, 
    changePassword,
    isProfileOwner,
    followOthersOnly
} = require('../helpers');

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);

/* POST /register */				//name="profimage" in form   upload1.single('profimage'),
router.post('/register', asyncErrorHandler(postRegister));

/* GET /register */
router.get('/register2', getRegister2);

/* POST /register */                //name="profimage" in form   upload1.single('profimage'),
router.post('/register2/:user_id',upload1.single('profimage'), asyncErrorHandler(postRegister2));

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET /logout */
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile/:user_id', isLoggedIn, asyncErrorHandler(getProfile));

router.get('/profile/:user_id/specificSect', isLoggedIn, asyncErrorHandler(getSpecficSect));

router.post('/profile/:user_id/sortTopics/:sort_method', isLoggedIn, asyncErrorHandler(sortFollowingTopics));

/* GET /profile/:user_id/edit */
router.get('/profile/:user_id/editbio', 
    isLoggedIn,
    isProfileOwner, //Checking 1st time in controllers
    asyncErrorHandler(getBio)       //Checking 2nd time in controllers
);

/* PUT /profile */
router.put('/profile/:user_id/editbio', 
    isLoggedIn,
    isProfileOwner,
	asyncErrorHandler(updateBio)    //uses body-parser
);

/* GET /profile/:user_id/edituser */
router.get('/profile/:user_id/edituser', 
    isLoggedIn,
    isProfileOwner, //Checking 1st time in controllers
    asyncErrorHandler(getEditProfile)       
);

/* PUT /profile */
router.put('/profile/:user_id/edituser', 
    isLoggedIn,
    upload1.fields([{ name: 'profimage', maxCount: 0||1 }, { name: 'backimage', maxCount: 0||1 }]),//multer comes before body-parser
    asyncErrorHandler(isProfileOwner),
	asyncErrorHandler(isValidPassword), //uses body-parser
    asyncErrorHandler(changePassword),  //uses body-parser
	asyncErrorHandler(updateProfile)    //uses body-parser
);

/* GET /forgot */
 router.get('/forgot-password', getForgotPw);

/* PUT /forgot */
 router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET /reset/:token */
 router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT /reset/:token */
 router.put('/reset/:token', asyncErrorHandler(putReset));

/* Get bookmark /bookmarks */
// Need to add extra layer to check wether it is the profile owner himself or not
router.get('/bookmarks', isLoggedIn, asyncErrorHandler(getBookmark));

router.get('/alloptions', isLoggedIn, getOptionsPage);

router.get('/advancedoptions', isLoggedIn, getAdvOptionsPage);

router.post('/followuser/:user_to_be_followed', isLoggedIn, followOthersOnly, asyncErrorHandler(followUser));

// ALWAYS AT THE LAST
//default route if someone tries to do anything from anywhere

// router.get('/images/:anything', getDefaultPage);

router.get('/invalid', getDefaultPage);
module.exports = router;

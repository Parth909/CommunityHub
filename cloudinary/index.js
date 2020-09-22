const crypto = require('crypto');
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'unifiq909',
	api_key: '147233253897761',
	api_secret: process.env.CLOUDINARY_SECRET
});
const cloudinaryStorage = require('multer-storage-cloudinary');
const storage1 = cloudinaryStorage({
	cloudinary,
	folder: 'uni1',
	allowedFormats: ['jpeg', 'jpg', 'png'],
	filename: function (req, file, cb) {
		let buf = crypto.randomBytes(16); //generating random 16 Bytes
		buf = buf.toString('hex'); //Converting to hex will give 32 CHARACTERS & converting to string
		let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, ''); //RegEx used to remove file expression
		uniqFileName += buf; //These CHARACTERS will be added to the filename
	  //Even though the user creates file with same name it will not MATCH bcz of CHARACTERS
	  cb(undefined, uniqFileName );
	}
  });

const storage2 = cloudinaryStorage({
	cloudinary,
	allowedFormats: ['mp4', 'webm', 'ogg'],
	params:{
		folder: 'uni1video',
		resource_type: 'video'
	},
	filename: function (req, file, cb) {
		let buf = crypto.randomBytes(16);
		buf = buf.toString('hex'); 
		let uniqFileName = file.originalname.replace(/\.mp4|\.webm|\.ogg/ig, ''); 
		uniqFileName += buf; 
	  cb(undefined, uniqFileName );
	}
  });

module.exports = {
	cloudinary,
	storage1,
	storage2
}
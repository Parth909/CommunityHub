const Hub = require('../models/hub');


module.exports = {

	newCat(req, res){
		res.render('hubs/new', {title: 'Settings'});
	},
	async catPost(req, res){
		const hub = new Hub(req.body.hub);
		await hub.save();
		return res.redirect(`/hubs/new`);
	}

}
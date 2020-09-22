const faker = require('faker');
const Post = require('./models/post');

async function seedPosts() {
	await Post.remove({});
	for(const i of new Array(600)) {
		const title = faker.lorem.word();
		const description = faker.lorem.text();
		const postData = {
			title,
			description,
			author: '5ea9bcab1f1a2325a17ef9d3'
		}
		let post = new Post(postData);
		post.save();
	}
	console.log('600 new posts created');
}

module.exports = seedPosts;
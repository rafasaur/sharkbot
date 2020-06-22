// test.js

//const config = require('./../resources/config.json');
const helpers = require(`./../resources/helpers.js`);

module.exports = {
	name: 'test',
	description: 'for testing things',
	execute(message, args) {
		let config = helpers.config;

    message.reply("nothing\'s being tested right now, but thanks for trying!");
    console.log(`Member ${message.member.displayName} wants to help test!`);

  },
};

// test.js

const config = require('./../resources/config.json');
const helpers = require(`./../resources/helpers.js`);

module.exports = {
	name: 'test',
	description: 'for testing things',
	execute(message, args) {

		if (config.commands.test.restricted) {
			if (!helpers.checkCallerID(message.member)) return;
		}

    message.reply("nothing\'s being tested right now, but thanks for trying!");
    console.log(`Member ${message.member.displayName} wants to help test!`);
  },
};

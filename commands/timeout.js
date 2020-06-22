// timeout.js

//const config = require('./../resources/config.json');
const helpers = require('./../resources/helpers.js')

module.exports = {
	name: 'timeout',
	description: 'put someone in timeout',
	execute(message, args) {
    if (!helpers.checkCallerID(message.member)) message.reply("you can't do that!");

    else {
      const timedOuts = message.mentions.members;
    }

  },
};

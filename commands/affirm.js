// affirm.js

const fs = require('fs');
const config = require('./../resources/config.json');

module.exports = {
	name: 'affirm',
	description: 'affirm your friends!',

	execute(message, args) {

		// message each member mentioned
    if (message.mentions.members.array().length > 0){
			for (const member of message.mentions.members.array()) {
				// make sure we're not DMing a bot
				if (!member.user.bot) {
					member.send("You\'re great and I love you!")
					.then(console.log(`Member ${member.displayName} affirmed!`))
				}
			}
    }

		// or just message the sender
    else {
      message.member.send("You\'re great and I love you!");
      console.log(`Member ${message.member.displayName} self-affirmed!`);
    }
    message.react('❤️')
  },
};

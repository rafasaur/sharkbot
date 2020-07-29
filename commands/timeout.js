// timeout.js

//const config = require('./../resources/config.json');
const helpers = require('./../resources/helpers.js')

module.exports = {
	name: 'timeout',
	description: 'put someone in timeout',
	execute(message, args) {
    if (!helpers.checkCallerID(message.member)) message.reply("you can't do that!");

    else {
      message.mentions.members
			.filter(mem => !helper.checkCallerID(mem))
			.each(mem => helpers.timedOut.set(mem.id,time))
			//wait given time
			message.mentions.members
			.each(mem => helpers.timedOut.delete(mem.id))
    }

  },

	help (message,args) {
		message.channel.send(this.description);
	}
};

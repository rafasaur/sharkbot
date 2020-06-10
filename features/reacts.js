//reacts.js

const config = require(`./../resources/config.json`);
const emoji = require(`./../resources/emoji.js`);

module.exports = {
  react (message) {
    const allEnabled = config.features.reacts.enabled.all;
		const msg = message.content.toLowerCase();

		if (allEnabled || config.features.reacts.strimmereact) {
			const strimmerRole = config.importantIDs.strimmerman;
			if (message.member.roles.cache.some(role => role.name === strimmerRole)) {
				message.react(emoji.heart);
			}
		}

		if (allEnabled || config.features.reacts.sharkbot) {
			if (msg.includes('sharkbot') || msg.includes('shark bot')) {
				message.react(emoji.sharkbot);
			}
		}

		if (allEnabled || config.features.reacts.spaghetti) {
			if (msg.includes('spagh')) message.react(emoji.spaghetti);
		}

		if (config.features.reacts.acab) {
			if (msg.includes(' cop ') || msg.includes('cops') || msg.includes('police')) {
				if (!message.author.bot && message.channel.name === 'bot-talk') message.channel.send('fuck cops');
			}
		}
  }
}

//reacts.js

const config = require(`./../resources/config.json`);
const emoji = require(`./../resources/emoji.js`);

module.exports = {
  name: "reacts",
  react (message) {
    const allEnabled = config.features.reacts.enabled.all;
		const msg = message.content.toLowerCase();

		if (allEnabled || config.features.reacts.strimmereact) {
			const strimmerRole = config.importantRoles.strimmerman;
			if (message.member.roles.cache.some(role => role.name === strimmerRole)) {
				message.react(emoji.heart);
			}
		}

		if (allEnabled || config.features.reacts.sharkbot) {
			if (msg.includes('sharkbot') || msg.includes('shark bot')) {
				if (!config.testMode) message.react(emoji.sharkbot);
			}
      if (msg.includes('smoothbot') || msg.includes('smooth bot')) {
        if (config.testMode) message.react(emoji.smoothbot);
      }
		}

		if (allEnabled || config.features.reacts.spaghetti) {
			if (msg.includes('spagh')) message.react(emoji.spaghetti);
		}

    if (allEnabled || config.features.reacts.cakeboss) {
      if (msg.includes('cakebo') || msg.includes('cake bo')) message.react(emoji.cake);
    }

		if (config.features.reacts.acab) {
			if (msg.includes(' cop ') || msg.includes('cops') || msg.includes('police')) {
				if (!message.author.bot && message.channel.name === 'bot-talk') message.channel.send('fuck cops');
			}
		}

    if (config.features.reacts.peachboy) {
      if (msg.includes('peaches') && message.author.id === config.ownerID) {
        message.react(emoji.peach);
      }
    }

    const selfHarmList = ['kill yourself', 'kill myself', 'kill your self',
      'kill my self', 'kys', 'kms', 'k y s'];
    const sendCheckIn = false;
    for (const alert of selfHarmList) {
      if (msg.includes(alert)) sendCheckIn = true;
    }

    if (sendCheckIn) {
      const atme = client.users.cache.get(config.ownerID);
      message.member.send("Hey, are you doing okay? We're here for you. Post in " +
        `#sharks-helping-sharks or main or wherever, or DM ${atme} if you'd like to talk!`);
    }
  }
}

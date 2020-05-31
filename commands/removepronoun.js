// removepronoun.js

const fs = require('fs');
const config = require('./../config.json');

module.exports = {
	name: 'removepronoun',
	aliases: ['removepronouns','rempronoun','rempronouns'],
	description: 'remove a pronoun role from user',
	execute(message, args) {
    //check if valid pronoun, add role
    const pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));
    for (let arg of args) {
			if (arg in pronouns) {
				try {
					const role = message.member.roles.cache.find(role => role.name === arg);
					message.member.roles.remove(role)
					.then(message.reply('removed those for you ❤️'));
					console.log(`Removed pronouns ${role.name} for member ${message.member.displayName}`);
				}
				catch(err) {
					console.error(err);
					message.reply('you haven\'t been assigned that pronoun!');
				}

      }
			else message.reply('that\'s not a pronoun!')
    };
  },
};

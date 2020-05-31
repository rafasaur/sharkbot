// addpronoun.js

const fs = require('fs');
const config = require('./../config.json');

module.exports = {
	name: 'addpronoun',
	aliases:['addpronouns'],
	description: 'adds a set of pronouns to the list',
	execute(message, args) {
		if (message.member.roles.cache.some(role => role.id === config.modID) ||
		message.member.id === config.botmaker) {
	    var pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));
	    for (var arg of args) {
	      if (arg.includes('/') && !(arg in pronouns)) {
	        message.guild.roles.create({
						data: {
					    name: arg,
					    color: 'BLUE',
					  },
					  reason: `${arg} was missing, so added`,
					})
					.then(role => pronouns[role.name] = role.id)
					//.then(console.log(pronouns))
	        message.channel.send(`Pronoun ${arg} added to list!`);
	        console.log(`Pronoun ${arg} added to list!`);
	      }
	      else {
					if (!arg.includes('/')) message.reply("expected, e.g., xie/xer");
					else if (arg in pronouns) message.reply(`${arg} already exists!`)
				}
	    }
			setTimeout(function() {
				 fs.writeFileSync(`./${config.pronounFile}`,JSON.stringify(pronouns));
			 },1000)
		}
		else {
			message.reply('please message or @ a mod for help!');
		}
	},
};

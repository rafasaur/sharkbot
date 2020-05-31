// setpronoun.js

const fs = require('fs');
const config = require('./../config.json');

module.exports = {
	name: 'setpronoun',
	aliases: ['pronoun','pronouns','setpronouns'],
	description: 'add a pronoun role to user',
	execute(message, args) {
    //check if valid pronoun, add role
    const pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));
    for (const arg of args) {
      if (arg in pronouns) {
				//console.log(arg);
        const role = message.guild.roles.cache.find(role => role.name === arg);
				//console.log(role);
        message.member.roles.add(role)
        .then(message.reply(`pronouns ${role.name} added!`));
        console.log(`Role ${role.name} added for member ${message.member.displayName}`);
			}
			else message.reply(`Pronouns ${arg} have not been created! Please message a mod to add them!`)
    };
  },
};

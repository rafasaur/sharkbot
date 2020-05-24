module.exports = {
	name: 'removepronoun',
	aliases: ['removepronouns','rempronoun','rempronouns'],
	description: 'remove a pronoun role from user',
	execute(message, args, config) {
    //check if valid pronoun, add role
    const pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));
    for (arg in args) {
      if (arg in pronouns) {
        const role = message.guild.roles.fetch(pronouns.arg);
        message.member.roles.add(role);
        message.reply(`Pronouns ${arg} added for member ${message.member}`);
        console.log(`Role ${arg} added for member ${message.member}`)
      }
			else message.reply(`Pronouns ${arg} have not been created! Please message a mod to add them!`)
    };
  },
};

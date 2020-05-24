module.exports = {
	name: 'addpronoun',
	aliases:['addpronouns'],
	description: 'adds a set of pronouns to the list',
	execute(message, args, config) {
    var pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));
    for (var arg of args) {
      if (arg.includes('/') && !(arg in pronouns))) {
        message.guild.roles.create({
					data: {
				    name: arg,
				    color: 'BLUE',
				  },
				  reason: `${arg} was missing, so added`,
				});
				.then(role => pronouns[arg] = role.id);
        message.channel.send(`Pronoun ${arg} added to list!`);
        console.log(`Pronoun ${arg} added to list!`);
      }
      else {
				if (!arg.includes('/')) message.reply("expected, e.g., xie/xer");
				else if (arg in pronouns) message.reply(`${arg} already exists!`)
			}
    }
    fs.writeFileSync(`./${config.pronounFile}`,JSON.stringify(pronouns));
    }
  },
};

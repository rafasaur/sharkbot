// help.js
// a (perhpaps needlessly) verbose helper

const config = require('./../resources/config.json');

module.exports = {
	name: 'help',
  aliases: ['info'],
	description: 'to assist users in deciphering my functions!',

	execute(message, args) {
		if (message.content.slice(0,) === `${config.prefix}info`) {
			this.info(message.channel);
			return;
		}

    if (!args || args.length === 0) {
      let commandList = '';
			message.client.commands
			.each(cmd => {
				if (!config.commands[cmd.name].secret) {
				commandList += '\t' + cmd.name + '\n';
					}
				})

      const reply = "Hi! Here's a list of things I can help with: \n" + commandList +
				`just type \`${config.prefix}help\` and then a command, and I'll do what I can!\n`+
				`If you want to know more about me, use \`${config.prefix}info\`!`;
      message.channel.send(reply);
    }

    for (const arg of args) {
      const command = message.client.commands.get(arg) ||
  			message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(arg));

      if (!command || config.commands[command.name].secret) message.reply(`${arg} is not a valid command!`);

			else if (!command.help) message.channel.send(`Sorry, I can't offer help for ${arg} yet!`);

			else command.help(message,args);
    }
  },

	help (message,args) {
		message.channel.send('Just here to help!');
	},

	info (channel) {
		const atme = channel.guild.members.cache.find(me => me.id === config.ownerID);
		let reply = `Hi! My name is SharkBot, and I was made by ${atme}! ` +
			`(whom you can give money to at ${config.donateURL})` +
			`You can find out more about what I can do by sending \`${config.prefix}help\`, `+
			"or find me on github, https://github.com/rafasaur/sharkbot"
		channel.send(reply);
	}
};

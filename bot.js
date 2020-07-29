// bot.js

const Discord = require('discord.js');

const fs = require('fs');
let schedule = require('node-schedule');

const helpers = require(`./resources/helpers.js`);

let config = helpers.config; //require('./resources/config.json');
let prefix, token;

if (config.testMode) {
	prefix = config.testPrefix;
	token = config.testToken;
}
else {
	prefix = config.prefix;
	token = config.token;
}

const emoji = require(`./resources/emoji.js`);


const client = new Discord.Client();
client.commands = new Discord.Collection();
client.features = new Discord.Collection();


// set up collections (anything mutable or client-side callable)
// ## commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
helpers.loadCommands(client,commandFiles);

// ## features
const featureFiles = fs.readdirSync('./features').filter(file => file.endsWith('.js'));
helpers.loadFeatures(client,featureFiles);


// load the bot
client.on('ready', async () => {
	console.log('Loading...');
	// set status of bot
	//await client.user.setStatus('available');
	await client.user.setStatus('dreaming of a smooth world...');

	// periodically check twitch
	//setInterval(() => twitch.fetchStream(client), 60000);

	// ## alarms
	if (config.commands.alarms.enabled) {
		const alarmFile = fs.readFileSync(`./resources/alarms.txt`,'utf8');
		helpers.loadAlarms(client,alarmFile);
	}

	if (config.testMode) console.log('smooth bot is ready for testing!');
	else console.log('SharkBot is ready to swim!');
});


// dynamic command handler
client.on('message', message => {

	if (config.log) console.log(`in ${message.channel.name}, ` +
				`from ${message.author.username}: ${message.content}`);

	// react with specific emotes if mentioned
	if (message.channel.type === 'text' && config.features.reacts.enabled) {
		client.features.get('reacts').react(message);
	}

	// if the author is a bot, don't do anything
  if (message.author.bot) return;

	// if the bot is DM'd send botmaker a message
  if (message.channel.type !== 'text') {
    const atme = client.users.cache.get(config.ownerID);
    message.reply('I don\'t work in DMs (yet!!), but I love you very much!\n'+
    `*((if this is an urgent matter please DM ${atme}))*`);
    client.users.cache.get(config.ownerID).send(`*DM from ${message.author.username}:*\n`+
	    																						`>>> `+message.content);
  }

	else {
		// if the author is on the watch list, DM the message
		if (helpers.watchList.has(message.member.id)) {
			client.users.cache.get(config.ownerID)
			.send(`${message.author.username}, in ${message.channel.name}:`+
		    																`>>> `+message.content);
		}

		// if someone has not been assigned pronouns, send them a message
	  if (config.commands.pronouns.enabled && config.commands.pronouns.pester &&
			!message.system && !config.testMode) client.commands.get('pronouns').checkAndPester(message);


		//if (helpers.timedOut.has(message.member.id)) {
			//message.delete({reason:"timed out"});
			//return;
		//}

		// check for commands
		if (!message.content.startsWith(prefix)) return;
		// this regex will find any command in the text: /\prefix+\w*/g


		// dynamically handle commands
	  else {
	    const args = message.content.slice(prefix.length).split(' ');
	    const commandName = args.shift().toLowerCase();

			// actually handle executing commands via files
	    const command = client.commands.get(commandName)
				|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			//console.log(commandName,command);
			if (!command) return;

	    try {
	    	command.execute(message, args);
				if (command.name === 'setprefix') {
					prefix = JSON.parse(fs.readFileSync(`./resources/config.json`,'utf8')).prefix;
				}
	    } catch (error) {
	    	console.error(error);
	    	message.reply('there was an error trying to execute that command!');
	    }
	  }
	}
});


// send welcome message
client.on('guildMemberAdd', member => {
	if (config.features.welcome.enabled && !config.testMode) {
		client.features.get(`welcome`).sendMessage(member);
	}
});

client.login(token);

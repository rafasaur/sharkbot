// bot.js

const Discord = require('discord.js');

const fs = require('fs');
var schedule = require('node-schedule');

const config = require('./resources/config.json');
let prefix = config.prefix;

const emoji = require(`./resources/emoji.js`);

const helpers = require(`./resources/helpers.js`);


const client = new Discord.Client();
client.commands = new Discord.Collection();
client.features = new Discord.Collection();

client.alarms = new Discord.Collection();


// set up collections (anything mutable or client-side callable)
// ## commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
helpers.loadCommands(client,commandFiles);

// ## features
const featureFiles = fs.readdirSync('./features').filter(file => file.endsWith('.js'));
helpers.loadFeatures(client,featureFiles);

// ## pronouns
//const pronouns = JSON.parse(fs.readFileSync(`./resources/pronouns.json`,'utf8'));
//if (config.pronouns.enabled) helpers.loadPronouns(client,pronouns);


// load the bot
client.on('ready', async () => {
	console.log('Loading...');
	// set status of bot
	//await client.user.setStatus('available');
	await client.user.setActivity('of electric meats', {type: 'DREAMING'});

	// periodically check twitch
	//setInterval(() => twitch.fetchStream(client), 60000);

	console.log('SharkBot is ready to swim!');
});


// dynamic command handler
client.on('message', message => {

	// react with specific emotes if mentioned
	if (message.channel.type === 'text' && config.features.reacts.enabled) {
		const reactFeature = client.features.get('reacts');
		reactFeature.react(message);
	}

	// if the author is a bot, don't do anything
  if (message.author.bot) return;

	// if the bot is DM'd send botmaker a message
  if (message.channel.type !== 'text') {
    const atme = client.users.cache.get(config.ownerID);
    message.reply('I don\'t work in DMs (yet!!), but I love you very much!\n'+
    `*((if this is an urgent matter please DM ${atme}))*`);
    client.users.cache.get(config.botmaker).send(`*DM from ${message.author.username}:*`)
    .then(client.users.cache.get(config.botmaker).send(`>>> `+message.content));
  }


	// if someone has not been assigned pronouns, send them a message
  if (config.commands.pronouns.enabled) client.commands.get('pronouns').checkAndPester(message);


	// check for commands
	if (!message.content.startsWith(prefix)) return;


	// dynamically handle commands
  else {
    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();

		// actually handle executing commands via files
    const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		console.log(commandName,command);

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
});



// send welcome message
client.on('guildMemberAdd', member => {

	if (config.features.welcome.enabled) client.features.get(`welcome`).sendMessage(member);

});

client.login(config.testToken);

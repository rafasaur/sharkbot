// things we want to do
// alerts when streamer goes online
// dm pronoun instructions - done!
// take over pronoun role assignment
//    read pronoun roles when turned on?
//    check & remind pronoun roles
// smooth goof - done!
//    implement role saving & message ignoral
// affirm
//    + random affirmations
// music

const Discord = require('discord.js');

const fs = require('fs');

const config = require('./config.json');

const prefix = config.prefix;
const pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const featureFiles = fs.readdirSync('./features').filter(file => file.endsWith('.js'));

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.features = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

for (const file of featureFiles) {
	const feature = require(`./features/${file}`);
	if (config.features.feature.enabled) client.features.set(feature.name, feature);
}

client.on('ready', async () => {
	console.log('Loading...');

	// set status of bot
	await client.user.setStatus('available');
	await client.user.setPresence({
		game: {
			name: 'of electric meat',
			type: "STREAMING",
			url: "github.com/rafasaur/sharkbot"
		}
	});

	// periodically check twitch
	setInterval(() => twitch.fetchStream(client), 60000);

	console.log('SharkBot is ready to swim!');
});


// dynamic command handler
client.on('message', message => {

	// always react to jpc
	if (message.author.id === config.importantIDs.strimmerman) message.react('❤️');

	// react with specific emotes if mentioned
	if (message.channel.type === 'text') {
		if (message.content.toLowerCase().includes('sharkbot') ||
			message.content.toLowerCase().includes('shark bot')) message.react(`705619021130891284`);
		if (message.content.toLowerCase().includes('spagh')) message.react(`705618446259322881`);
	}

	// if the author is a bot, don't do anything
  if (message.author.bot) return;

	// if the bot is DM'd send botmaker a message
  else if (message.channel.type !== 'text') {
    const atme = client.users.cache.get(config.botmaker);
    message.reply('I don\'t work in DMs (yet!!)')
    .then(message.reply('(but I love you very much)'))
    .then(message.reply(`*((if this is an urgent matter please DM ${atme}))*`));
    client.users.cache.get(config.botmaker).send(`*DM from ${message.author.username}:*`)
    .then(client.users.cache.get(config.botmaker).send(`>>> `+message.content));
  }

	// if someone has not been assigned pronouns, send them a message
  else if (!message.member.roles.cache.some(role => role.name in pronouns) &&
		(message.content.slice(0,11) !== `${prefix}setpronoun`) &&
		(!client.commands.get('setpronoun').aliases.includes(message.content.slice(prefix.length).split(' ')[0]))) {
      message.member.send("Hi! I noticed you haven't assigned yourself a pronoun role yet."+
      " It would mean a lot if you did!")
      .then(message.member.send("If assigning yourself pronouns makes you uncomfortable,"+
      " that\'s okay! We have any/all and no/thx available as well."+
      " If these don't suit you either, please message a mod!"))
      .then(message.member.send("(also yes you will get this every time you send a message."+
      " It's not to be annoying, it's just the person who coded me is lazy)"));
  }

	// check for commands
	else if (!message.content.startsWith(prefix)) return;


	// dynamically handle commands
  else {
    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();

		// if testing something - eventually move to own file
    if (commandName === 'test') {
      message.reply("nothing\'s being tested right now, but thanks for trying!");
      console.log(`Member ${message.member.displayName} wants to help test!`);
      return;
    }

		// make pronoun assigning easier
		else if (commandName in pronouns) {
			//console.log(arg);
      const role = message.guild.roles.cache.find(role => role.name === commandName);
			//console.log(role);
      message.member.roles.add(role)
      //.then(message.reply(`pronouns ${role.name} added!`));
      console.log(`Role ${role.name} added for member ${message.member.displayName}`);
		}

		// actually handle executing commands via files
    const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

    try {
    	command.execute(message, args);
    } catch (error) {
    	console.error(error);
    	message.reply('there was an error trying to execute that command!');
    }
  }
});


// send welcome message
client.on('guildMemberAdd', member => {
  let smoothed = JSON.parse(fs.readFileSync(`./smoothers.json`,'utf8'));
  if (member.id in smoothed) {
    member.send("Welcome back!");
    for (role in smoothed.member.id) member.roles.add(role);
    delete smoothed.member.id;
    fs.writeFileSync(`./smoothers.json`,JSON.stringify(smoothed));
  }
  else {
    const pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));
		let pronounList = `>>> `;
    for (pn in pronouns) pronounList += pn + '\n';
    member.send("Hi! Welcome to the Tank!")
		.then(member.send("In order to Be Excellent to Each Other we request that you "+
			"assign yourself the pronouns you use! You can do this by sending "+
			"\`%pronoun <your pronoun here>\` (e.g.: \`%pronoun she/they\`) "+
			`in any of the channels (but preferably #bot-talk).`))
		.then(member.send("If the pronouns you use have not yet been added, "+
			"please message one of the mods and they will add it for you!"))
		.then(member.send("Currently, the following pronouns are available:"))
    .then(member.send(pronounList))
		.then(member.send("Once again, welcome! We're so glad you're here. "+
			"Tanks for the memories!"));
    console.log(`Welcome message sent to ${member.displayName}`);
  }
});

client.login(config.token);

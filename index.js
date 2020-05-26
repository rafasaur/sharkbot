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

const fs = require('fs')

const config = require('./config.json');
const prefix = config.prefix;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const client = new Discord.Client();
client.commands = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}


client.on('ready', () => {
  console.log('I am ready!');
	client.user.setStatus('available');
	client.user.setPresence({
		game: {
			name: 'of electric meat',
			type: "STREAMING",
			url: "github.com/rafasaur/sharkbot"
		}
	});
});

client.on('message', message => {
  // console.log(message.content);
  const pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));

	if (message.author.id === config.strimmerman) message.react('❤️');

  if (message.author.bot) return;

  else if (message.channel.type !== 'text') {
    const atme = client.users.cache.get(config.botmaker);
    message.reply('I don\'t work in DMs (yet!!)')
    .then(message.reply('(but I love you very much)'))
    .then(message.reply(`*((if this is an urgent matter please DM ${atme}))*`));
    client.users.cache.get(config.botmaker).send(`*DM from ${message.author.username}:*`)
    .then(client.users.cache.get(config.botmaker).send(`>>> `+message.content));
  }

  else if (!message.member.roles.cache.some(role => role.name in pronouns)
   && (message.content.slice(0,11) !== `${prefix}setpronoun`)) {
      message.member.send("Hi! I noticed you haven't assigned yourself a pronoun role yet."+
      " It would mean a lot if you did!")
      .then(message.member.send("If assigning yourself pronouns makes you uncomfortable,"+
      " that\'s okay! We have any/all and no/thx available as well."+
      " If these don't suit you either, please message a mod!"))
      .then(message.member.send("(also yes you will get this every time you send a message."+
      " It's not to be annoying, it's just the person who coded me is lazy)"));
  }

	else if (!message.content.startsWith(prefix)) return;

  else {
    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();

    if (commandName === 'test') {
      message.reply("nothing\'s being tested right now, but thanks for trying!");
      console.log(`Member ${message.member.displayName} wants to help test!`);
      return;
    }

    const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

    try {
    	command.execute(message, args, config, fs);
    } catch (error) {
    	console.error(error);
    	message.reply('there was an error trying to execute that command!');
    }
  }
});

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
    let welcomeMsg = fs.readFileSync(`./${config.welcomeText}`,'utf8');
    welcomeMsg = welcomeMsg.split('<>');
    let pronounList = "";
    for (pn in pronouns) pronounList += "   " + pn + '\n';
    //console.log(pronouns);
    welcomeMsg.splice(3,0,pronounList);
    //console.log(welcomeMsg)
    member.send(welcomeMsg.flat());
    console.log(`Welcome message sent to ${member.displayName}`)
  }
});

client.login(config.token);

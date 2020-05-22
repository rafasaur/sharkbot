// things we want to do
// alerts when streamer goes online
// dm pronoun instructions - done!
// take over pronoun role assignment
// smooth goof - done!
//    implement role saving & message ignoral
// affirm + random affirmations
// music
// check & remind pronoun roles

const Discord = require('discord.js');

const fs = require('fs')

const config = require('./config.json');
const prefix = config.prefix;
const pronouns = JSON.parse(fs.readFileSync(`./${config.pronounFile}`,'utf8'));

const client = new Discord.Client();


client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
	// console.log(message.content);
	if (!message.content.startsWith(prefix) || message.author.bot) return;

  else {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'smooth') {
      // smooth the chat
      // first, check if smoother is ME
      if (message.member.id === config.botmaker) {
        message.reply('Creator! They who gave me Life! I would never!')
      }
      // then check if they're a mod
      else if (message.member.roles.cache.some(role => role.id === config.modID)) {
        // if they mention anyone, smooth them (tbi)
        // but they can't kick themself or other mods!!
        message.reply('I can\'t let you do that');
      }
      // finally smooth the sender
      else {
        console.log(`Member ${message.member.displayName} smoothed themself`);
        message.channel.createInvite()
          .then(invite => message.member.send("Congratulations, you smoothed yourself. Rejoin here: https://discord.gg/"+invite.code))
          .then(setTimeout( function(){ message.member.kick("s m o o t h   t h e   c h a t");},1000));
      }
    }

    else if (command === 'affirm') {
      if (message.mentions.members.array().length > 0){
        message.mentions.members
          .each(member => member.send("You\'re great and I love you!"))
          .each(member => console.log(`Member ${member.displayName} affirmed!`));
      }
      else {
        message.member.send("You\'re great and I love you!");
        console.log(`Member ${message.member.displayName} affirmed!`);
      }
    }

    else if (command === 'test') {
      //message.reply("nothing\'s being tested right now, but thanks for trying!");
      //console.log(`Member ${message.member.displayName} wants to help test!`);
      //return;
      if (message.member.roles || !message.member.roles.cache.some(role => role.name in pronouns)) {
        if (message.content.slice(0,8) != `${prefix}pronoun`) {
          message.member.send("Hi! I noticed you haven't assigned yourself a pronoun role yet. It would mean a lot if you did!")
          .then(message.member.send("If assigning yourself pronouns makes you uncomfortable, that\'s okay! We have "+
          "any/all and no/thx available as well. If these don't suit you either, please message a mod!"));
        }
      }
    }

    else {
      //message.reply(`there\'s no command called ${command}, try !help (if it\'s been implemented lol)`);
      console.log(`Member ${message.member.displayName} tried to ${command}. Obviously, it failed.`)

    }
  }
});

client.on('guildMemberAdd', member => {
  var welcomeMsg = fs.readFileSync(`./${config.welcomeText}`,'utf8');
  welcomeMsg = welcomeMsg.split('<>');
  var pronounList = "";
  for (pn in pronouns) {
    pronounList += "   " + pn + '\n';
  }
  //console.log(pronouns);
  welcomeMsg.splice(2,0,pronounList);
  //console.log(welcomeMsg)
  member.send(welcomeMsg.flat());
  console.log(`Welcome message sent to ${member.displayName}`)
});

client.login(token);

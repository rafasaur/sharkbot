// things we want to do:
// alerts when streamer goes online
// dm pronoun instructions
// take over pronoun role assignment

const Discord = require('discord.js');

const fs = require('fs')

const {prefix, token, pronounFile, pronounJSON, welcomeFile} = require('./config.json');

const client = new Discord.Client();


client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
	// console.log(message.content);
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    // print (dm?) help info
    return;
  }

  else if (command.slice(0,7) === 'pronoun') {
    //check if valid pronoun, add role
    const pronouns = fs.readFileSync(`./${pronounFile}`,'utf8');
    for (arg of args) {
      if (pronouns.includes(arg)) {

        const role = message.guild.roles.fetch(arg);
        message.member.roles.add(role);
        message.channel.send(`Role ${role} added for member ${message.member}`);
        console.log(`Role ${role} added for member ${message.member}`)
      }
    };
    return;
  }

  else if (command === 'addpronoun'){
    // should check for mod permissions first
    const pronouns = fs.readFileSync(`./${pronounFile}`,'utf8');
    var updatedPns = pronouns.slice(0,-2)
    var arg;
    for (arg of args){
      if (arg.includes('/') && !pronouns.includes(arg)) {
        updatedPns = updatedPns.concat(',   ',arg);
        message.channel.send(`Pronoun ${arg} added to list!`);
        console.log(`Pronoun ${arg} added to list!`)
      }
      else; // print something
    };
    fs.writeFileSync(`./${pronounFile}`,updatedPns.concat('\r\n'));
  }

  else if (command === 'smooth') {
    // smooth the chat
    // idea: self-kick, but message with invite before
    return;
  }

  else if (command === 'afirm') {
    message.member.send("You\'re great and I love you!");
  }
});

client.on('guildMemberAdd', member => {
  var welcomeMsg = fs.readFileSync(`./${welcomeFile}`,'utf8');
  var pronouns = fs.readFileSync(`./${pronounFile}`,'utf8');
  welcomeMsg = welcomeMsg.split('<>');
  pronouns = pronouns.split(',');
  //console.log(pronouns);
  welcomeMsg.splice(2,0,pronouns);
  //console.log(welcomeMsg)
  member.send(welcomeMsg.flat());
});

client.login(token);

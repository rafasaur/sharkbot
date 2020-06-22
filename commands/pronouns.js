// pronouns.js

const fs = require('fs');
const config = require('./../resources/config.json');
const helpers = require('./../resources/helpers.js');
const emoji = require('./../resources/emoji.js')

const aliases = ["pronoun","setpronoun","setpronouns"];
const addAliases = ["addpronoun","addpronouns"];
const delAliases = ["deletepronoun","deletepronouns","delpronoun","delpronouns"];
const remAliases = ['removepronoun','removepronouns','rempronoun','rempronouns'];
const listAliases = ['listpronouns','listpronoun','pronounlist'];

let pronounList = fs.readFileSync(`./resources/pronouns.txt`,'utf8').replace(/\n|\r|\t/g,'').split(' ');
// probably should check to make sure the listed pronouns are actually roles but :shrug:

const allAliases = aliases.concat(addAliases,delAliases,remAliases,listAliases,pronounList);


module.exports = {
  name: "pronouns",
  aliases: allAliases,
  description: "for managing pronoun roles on the server",

  help(message,args) {
    const reply = `Expected use of pronoun is \`${config.prefix}pronoun your/pronouns\`. ` +
      `Alternatively, you can just type \`${config.prefix}your/pronouns\`. ` +
      "If the pronouns you use haven't been added yet, please @ or DM a mod! " +
      `(to see a list of all added pronouns, use the command ${config.prefix}listpronouns).`;
    message.channel.send(reply);
  },

  execute (message,args) {
    // re-establish commandName
    const command = message.content.slice(config.prefix.length).split(' ')[0].toLowerCase();

    // quick set pronouns
    if (pronounList.includes(command)) this.set(message,[command]);

    // check for other command possibilities
    else if (command.includes("add") || command.includes("del")) {
      if (!config.commands.pronouns.restricted ||
        (config.commands.pronouns.restricted && helpers.checkCallerID(message.member))) {
        if (command.includes('add')) this.add(message,args);
        else this.delete(message,args)
      }
    }
    else if (command.includes("rem")) this.remove(message,args);
    else if (command.includes("list")) this.listpronouns(message,args);
    else this.set(message,args);
  },

  listpronouns (message,args) {
    let pronounListText = ">>> ";
    for (const pn of pronounList) {
      pronounListText += pn+'\n';
    }
    const reply = "The list of currently active pronouns is:\n" + pronounListText;
    message.channel.send(reply);
  },

  add (message,args) {
    // add pronoun role to guild & updated list & aliases
    for (var pronoun of args) {
      if (pronoun.includes('/') && !pronounList.includes(pronoun)) {
        // create role
        message.guild.roles.create({
          data: {
            name: pronoun,
            color: 'BLUE',
          },
          reason: `${pronoun} was missing, so added`,
        })
        // add pronoun to global list & aliases
        .then(role => {
          pronounList.push(role.name);
          this.aliases.push(role.name);
        })
        .then(message.channel.send(`Pronoun ${pronoun} added!`))
        .then(console.log(`Pronoun ${pronoun} added to list!`));
      }

      else {
        if (!arg.includes('/')) message.reply("expected, e.g., xie/xer");
        else if (pronounList.includes(arg)) message.reply(`${pronoun} already exists!`)
      }
    }

    // after looping through pronouns, rewrite list to file for preservation
    setTimeout( function() {
      console.log(`pronoun list writing to file: ${pronounList}`);
      fs.writeFileSync(`./resources/pronouns.txt`,pronounList.join(' '));
    },1000)
  },


  delete (pronouns) {
    // remove the role from the guild
  },


  remove (message, args) {
    for (var pronoun of args) {
      if (pronoun in pronounList) {
  			try {
  				const role = message.member.roles.cache.find(role => role.name === pronoun);
  				message.member.roles.remove(role)
  				.then(message.react(emoji.thumbsup));
  				console.log(`removed pronouns ${role.name} for member ${message.member.displayName}`);
  			}
  			catch(err) {
  				console.error(err);
  				message.reply('you haven\'t been assigned that pronoun!');
  			}
      }
      else message.reply('that\'s not a pronoun!')
    }
  },


  set (message, args) {
    for (pronoun of args) {
      //check if & assign valid pronoun
      if (pronounList.includes(pronoun)) this.assign(message,pronoun);

      // if not a valid pronoun & author doesn't have access, tell them as such
      else if (config.commands.pronouns.restricted && !helpers.checkCallerID(message.member)) {
        message.reply(`Pronouns ${arg} have not been created! Please message a mod to add them!`);
      }
      // if nothing's restricted or author has mod rights, create & assign role
      else if (!config.commands.pronouns.restricted ||
        (config.commands.pronouns.restricted && helpers.checkCallerID(message.member))) {
          this.add(message,[pronoun]);
          this.assign(message,pronoun);
      }
    }
  },

  assign (message, pronoun) {
    // since this was used twice in set(), it became its own function
    const role = message.guild.roles.cache.find(role => role.name === pronoun);
    message.member.roles.add(role)
    .then(message.react(emoji.thumbsup));

    console.log(`pronoun ${role.name} added for member ${message.member.displayName}`);
  },


  checkAndPester(message) {
    // first check if we even need to be here
    if (message.member.roles.cache.some(role => pronounList.includes(role.name))) return;

    // peel off first word in message
    const firstWord = message.content.slice(config.prefix.length).split(' ')[0];
		// check if the user is trying to assign pronouns
		if (firstWord !== this.name && !this.aliases.includes(firstWord) &&
			!(firstWord in pronounList)) {
        // if not, pester away
	      message.member.send("Hi! I noticed you haven't assigned yourself a pronoun role yet."+
	      " It would mean a lot if you did!\n"+
	      "If assigning yourself pronouns makes you uncomfortable,"+
	      " that\'s okay! We have *any/all* and *no/thx* available as well."+
	      " If these don't suit you either, please message a mod!\n"+
	      "(also yes you will get this every time you send a message."+
	      " It's not to be annoying, it's just the person who coded me is lazy)");

        console.log(`member ${message.member.displayName} pestered!`);
		}
  }

};

// groups.js

let config = require('./../resources/config.json');
const helpers = require('./../resources/helpers.js')
let groupRoles = config.commands.groups.roles;

module.exports = {
	name: 'groups',
  aliases: ['group','join','leave'],
	description: 'group role management',

	execute(message, args) {
		const word1 = getCommandName(message);
		const arg0 = args.shift();
    if (arg0 === "add") this.add(message,args);
    else if (arg0 === "leave" || word1 === "leave") {
			if (arg0 !== "leave") args.unshift(arg0);
			this.leave(message,args);
		}
    else {
			if (arg0 !== "join") args.unshift(arg0);
			this.join(message,args);
		}
  },

  help (message,args) {
    message.channel.send("To join a group, use \`!join group\`, e.g., \`!join bookclub\`.");
  },

  async join(message,args) {
		// first filter off any roles that aren't roles
		const validRoles = args.filter(arg => arg in groupRoles);
		// then find and add each role mentioned
    for (role of validRoles) {
      const addRole = findRole(message,role);
      message.member.roles.add(addRole);
    }
		// also check for @'d roles (why would someone @ a whole group tho??)
		if (message.mentions && message.mentions.roles) {
			const mentionedRoles = await message.mentions.roles.filter(role => Object.values(groupRoles).some(elem => elem === role.id));
			await mentionedRoles.each(role => message.member.roles.add(role));
		}
    message.react('👍');
  },


  leave(message,args) {
    for (arg of args) {
      const remRole = findRole(message,arg);
      message.member.roles.remove(remRole);
    }
    message.react('👍');
  },


  async add(message,args) {
    if (config.commands.groups.restricted && !helpers.checkCallerID(message.member)) {
      message.reply("mods only, I'm afraid");
    }
    for (arg of args) {
      const newRole = await message.guild.roles.create({data:{
        name:arg, color:config.commands.groups.color, mentionable:true}
      });
      groupRoles[arg] = newRole.id;
      console.log(groupRoles);
    }
    config.commands.groups.roles = groupRoles;
    await helpers.updateConfig(config);
    console.log("groups added successfully!");
    message.react('👍');
    config = helpers.config;
  }
};


function findRole (message,arg) {
	//if (arg.id && groupRoles.values().includes(arg.id)) return arg;

  if (arg.includes("meds") || arg.includes("remind")) {
    return message.guild.roles.cache.get(groupRoles["meds-remindees"]);
  }

  else if (arg.includes("book")) {
    return message.guild.roles.cache.get(groupRoles["bookclub"]);
  }

  else {
		try {
    	return message.guild.roles.cache.get(groupRoles[arg]);
		}
		catch (err) {console.log("issue finding role: "+err);}
  }
}

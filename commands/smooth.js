// smooth.js

const fs = require('fs');
const config = require('./../resources/config.json');
const emoji = require('./../resources/emoji.js')

module.exports = {
	name: 'smooth',
	description: 'smooth the chat',

	help(message,args) {
		message.channel.send(`Just do it, friend. Smooth thyself. ${config.prefix}smooth`);
	},

	execute(message, args) {
		console.log(`\nsmoothing...`);

		// for a solitary smooth
		if (message.mentions.members.array().length === 0){

			// owner can't smooth themself!
	    if (message.member.id === config.ownerID) {
				console.log(`creator?! never!\n`);
	      message.reply('Creator! They who gave me Life! I would never!');
	    }

			// check if the smoother is a mod (tbi)
			else if (message.member.roles.cache.some(role => role.name in config.importantRoles)) {
				message.reply('I can\'t let you do that!');
			}

			// all set, smooth ahead!
			else {
				smoothMember(message.channel,message.member);
				message.react(emoji.smooth);
			}
		}

		// smoothing others (tbi) (should be limited to mods)
		else message.channel.send("I can't smooth others, but maybe someday! :)")
	},
};

function smoothMember (channel,member) {
	let smoothed = JSON.parse(fs.readFileSync(`./resources/smoothers.json`,'utf8'));
	smoothed[member.user.id] = {};
	smoothed[member.user.id]["roles"] = [];
	smoothed[member.user.id]["nickname"] = member.nickname;
	member.roles.cache.each(role => smoothed[member.user.id]['roles'].push(role.id));

	channel.createInvite()
		.then(invite => member.send("Congratulations, you've been smoothed. "+
			"Rejoin here: https://discord.gg/"+invite.code));

	setTimeout( function(){
		fs.writeFileSync(`./resources/smoothers.json`,JSON.stringify(smoothed,null,'\t'));
		member.kick("s m o o t h   t h e   c h a t");
		console.log(`${member.displayName} has been smoothed!`);
	},1000);
}

// smooth.js

const fs = require('fs');
const config = require('./../resources/config.json');

module.exports = {
	name: 'smooth',
	description: 'smooth the chat',
	execute(message, args) {
		console.log(`smoothing...`);

		// for a solitary smooth
		if (message.mentions.members.array().length === 0){

			// owner can't smooth themself!
	    if (message.member.id === config.ownerID) {
				console.log(`creator?! never!`);
	      message.reply('Creator! They who gave me Life! I would never!');
	    }

			// check if the smoother is a mod (tbi)
			else if (message.member.roles.cache.some(role => role.name in config.importantRoles)) {
				message.reply('I can\'t let you do that!');
			}

			// all set, smooth ahead!
			else smoothMember(message.channel,message.member);
		}

		// smoothing others (tbi) (should be limited to mods)
		else message.channel.send("I can't smooth others, but maybe someday! :)")
	},
};

function smoothMember (channel,member) {
	let smoothed = JSON.parse(fs.readFileSync(`./resources/smoothers.json`,'utf8'));
	channel.createInvite()
		.then(invite => member.send("Congratulations, you've been smoothed. "+
			"Rejoin here: https://discord.gg/"+invite.code))
		.then(smoothed[member.user.username] = [])
		.then(member.roles.cache.each(role => smoothed[member.user.username].push(role.id)));

	setTimeout( function(){
		fs.writeFileSync(`./resources/smoothers.json`,JSON.stringify(smoothed,null,'\t'));
		member.kick("s m o o t h   t h e   c h a t");
		console.log(`${member.displayName} has been smoothed!`);
	},1000);
}

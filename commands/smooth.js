// smooth.js

const fs = require('fs');
const config = require('./../resources/config.json');
const emoji = require('./../resources/emoji.js');
const helpers = require('./../resources/helpers.js')

module.exports = {
	name: 'smooth',
	description: 'smooth the chat',

	help(message,args) {
		message.channel.send(`Just do it, friend. Smooth thyself. ${config.prefix}smooth`);
	},

	async execute(message, args) {
		console.log(`\nsmoothing...`);

		// for a solitary smooth
		if (!args || message.mentions.members.array().length === 0){

			// owner can't smooth themself!
	    if (message.member.id === config.ownerID) {
				console.log(`creator?! never!\n`);
	      message.reply('Creator! They who gave me Life! I would never!');
	    }

			// check if the smoother is a mod
			else if (helpers.checkCallerID(message.member)) {
				message.reply('I can\'t let you do that!');
			}

			// all set, smooth ahead!
			else {
				smoothMember(message.channel,message.member);
				message.react(emoji.smooth);
			}
		}

		// smoothing others (tbi) (should be limited to mods)
		else if (helpers.checkCallerID(message.member) && message.mentions.members) {
			const membersToSmooth = await message.mentions.members.filter(mem => !helpers.checkCallerID(mem));
			await membersToSmooth.each(mem => smoothMember(message.channel,mem))
			message.react(emoji.smooth);
		}
	},
};

async function smoothMember (channel,member) {
	// open the book of the smooothed & write a new name
	let smoothed = await JSON.parse(fs.readFileSync(`./resources/smoothers.json`,'utf8'));
	smoothed[member.user.id] = {};
	smoothed[member.user.id]["roles"] = [];
	smoothed[member.user.id]["nickname"] = member.nickname;
	member.roles.cache.each(role => smoothed[member.user.id]['roles'].push(role.id));

	// create & send invite to smoothed one
	const invite = await channel.createInvite({maxUses:1})
	await member.send("Congratulations, you've been smoothed. "+
		"Rejoin here: https://discord.gg/"+invite.code);

	// close the book & smooth
	await fs.writeFileSync(`./resources/smoothers.json`,JSON.stringify(smoothed,null,'\t'));
	member.kick("s m o o t h   t h e   c h a t");
	console.log(`${member.displayName} has been smoothed!`);

}

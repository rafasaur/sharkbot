// smooth.js

const fs = require('fs');
const config = require('./../config.json');

module.exports = {
	name: 'smooth',
	description: 'smooth the chat',
	execute(message, args) {
    // check if you made this
    if (message.member.id === config.importantIDs.botmaker) {
      message.reply('Creator! They who gave me Life! I would never!')
    }
    // then check if they're a mod
    else if (message.member.roles.cache.some(role => role.id === config.importantIDs.modID)) {
      // if they mention anyone, smooth them (tbi)
      // but they can't kick themself or other mods!!
      message.reply('I can\'t let you do that');
    }
    // finally smooth the sender
    else {
      let smoothed = JSON.parse(fs.readFileSync(`./../smoothers.json`,'utf8'));
      console.log(`Member ${message.member.displayName} smoothed themself`);
      message.channel.createInvite()
        .then(invite => message.member.send("Congratulations, you smoothed yourself."
        +" Rejoin here: https://discord.gg/"+invite.code))
				.then(smoothed[message.member.id] = [])
        .then(for(role of message.member.roles.cache) {
					smoothed[message.member.id].push(role.id)
				})
        .then(setTimeout( function(){ message.member.kick("s m o o t h   t h e   c h a t");},1000));
    }
	},
};

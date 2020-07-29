// affirm.js

const fs = require('fs');
const helpers = require('./../resources/helpers.js');
const config = helpers.config;

let affirmations = fs.readFileSync('./resources/affirmations.txt','utf8').replace(/\r|\t/g,'').split('\n');
// text files have an annoying habit of saving one blank line. So we pop it off
affirmations.pop();

module.exports = {
	name: 'affirm',
	description: 'affirm your friends!',

	execute(message, args) {

		// message each member mentioned
    if (message.mentions.members.array().length > 0){
			for (const member of message.mentions.members.array()) {
				// make sure we're not DMing a bot
				if (!member.user.bot) {
					const affirmMsg = affirmations[Math.floor(Math.random() * affirmations.length)];
					console.log(affirmMsg);
					member.send(affirmMsg)
					.then(console.log(`Member ${member.displayName} affirmed!`));
				}
			}
    }

		// or just message the sender
    else {
			const affirmMsg = affirmations[Math.floor(Math.random() * affirmations.length)];
			console.log(affirmMsg);
      message.member.send(affirmMsg);
      console.log(`Member ${message.member.displayName} self-affirmed!`);
    }
    message.react('❤️')
  },


	help(message,args) {
		message.channel.send(this.description);
	}
};



function sendCakeLyrics (channel,title) {
	let lyr;

	// if no title was included, post a random lyric
	if (!title) {
		lyr = '\`\`\`'+ lyrics[Math.floor(Math.random() * lyrics.length)] +'\`\`\`';
		console.log('sending random...')
	}

	// if a title was attempted but is not recognized, say so, and do nothing
	else if (!lyricsFiles.includes(title+'.txt')) {
		channel.send(`that's not a title I understand! `+
		"(currently I don't know punctuation either so omit any of that nonsense)");
		return;
	}

	// otherwise, send the lyrics to the corresponding song
	else {
		lyr = '\`\`\`' + fs.readFileSync(`./lyrics/${title}.txt`,'utf8') + '\`\`\`';
		console.log(`sending ${title}...`);
	}
	//console.log(lyr);
	channel.send(lyr);
}

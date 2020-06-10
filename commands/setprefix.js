// setprefix.js

const fs = require('fs')

module.exports = {
	name: 'setprefix',
	aliases : ['prefix'],
	description: 'change the prefix the bot uses',
	execute(message,args) {
		let config = JSON.parse(fs.readFileSync(`./resources/config.json`,'utf8'));
		config.prefix = args[0];
		fs.writeFileSync(`./resources/config.json`,JSON.stringify(config,null,'\t'));
		console.log(`prefix set in setprefix.js`);
  },
};

// helpers.js

//const Discord = require('discord.js');
const fs = require('fs');
let config = JSON.parse(fs.readFileSync('./resources/config.json','utf8'));
config["rafID"] = "197687298198863872";
config["donateURL"] = "https://ko-fi.com/rafasaur";
let emoji = require('./../resources/emoji.js');

module.exports = {

  config : config,
  emoji: emoji,

  updateConfig (newConfig) {
    this.config = newConfig;
    fs.writeFileSync('./resources/config.json',JSON.stringify(this.config,null,'\t'));
    console.log("config.json written to file");
  },

  getCommandName (message) {
    return message.content.slice(this.config.prefix.length).split(' ')[0].toLowerCase();
  },

  checkCallerID (member) {

  	if (member.roles.cache.some(role => role.name in config.importantRoles) ||
    (config.ownerID === member.user.id)) {
  		console.log(`passed!`);
  		return true;
  	}
  	else {
      console.log(`nope!`);
      return false;
    }
  },

  loadCommands (client,commandFiles) {
    for (const file of commandFiles) {

    	const commandName = file.split('.')[0];

    	if (commandName in config.commands) {
    		if (config.commands[commandName].enabled) {
    			// set a new item in the Collection
    			// with the key as the command name and the value as the exported module
    			const command = require(`./../commands/${file}`);
    			client.commands.set(command.name, command);
    		}
    		else console.log(`command ${commandName} not enabled`);
    	}
    	else console.log(`command ${commandName} is not in the config file!`);
    }
  },

  loadFeatures (client,featureFiles) {
    for (const file of featureFiles) {

    	const featureName = file.split('.')[0];

    	if (featureName in config.features) {
    		if (config.features[featureName].enabled) {
    			// set features
    			const feature = require(`./../features/${file}`);
    			client.features.set(featureName, feature);
    		}
    		else console.log(`feature ${featureName} not enabled`);
    	}
    	else console.log(`feature ${featureName} is not in the config file!`);
    }
  },


  loadAlarms (client, alarmFile) {
    for (const alarm of alarmFile.match(/\{([^\;]+)\}/g)) {
      client.commands.find(cmd => cmd.name === 'alarms').setAlarm(client, JSON.parse(alarm));
    }
  }
}

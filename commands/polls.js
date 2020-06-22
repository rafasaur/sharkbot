// polls.js

const config = require('./../resources/config.json');
const helpers = require('./../resources/helpers.js');
const emoji = require(`./../resources/emoji.js`);

module.exports = {
  name: "polls",
  aliases: ["startpoll","addpoll","poll","modpoll"],
  description: "for polling",

  help(message,args){
    let reply = `Expected use of polls is \`${config.prefix}poll ` +
      "{description of poll} [option 1] [option 2] [etc]\`, and " +
      "I'll fill in yes/no/maybe if you don't provide options!";
    message.channel.send(reply);
  },

  execute (message,args) {
    // expected format: !poll {description} [option1] [option2] [option3] [etc...]
    const command = message.content.slice(config.prefix.length).split(' ')[0].toLowerCase();

    if (command === 'modpoll' && helpers.checkCallerID(message.member)) {
      const ch = message.guild.channels.cache.find(ch => ch.name === 'announcements');
      this.addPoll(message, ch);
    }

    else if (command === 'polls') listPolls();

    else this.addPoll(message,message.channel)

  },

  addPoll (message, channel) {
    const info = message.content.match(/\{([^\}]+)\}/g);
    const description = info[0].slice(1,-1);
    let messageText = "**POLL**: "+description+'\n';

    const options = message.content.match(/\[([^\]]+)\]/g);

    if (!options) {
      this.makeSimpPoll(messageText,channel);
      return;
    }

    const customoji = info.length === options.length+1; let customojiList = [];

    for (let i in options) {
      i = Number(i);
      if (customoji) {
        customojiList += info[i+1].slice(1,-1);
        console.log(customojiList[i]);
        messageText += customojiList[i] + ' : ' + options[i].slice(1,-1) + '\n';
      }
      else messageText += emoji.numbers[i+1] +' : '+ options[i].slice(1,-1) + '\n';
    }

    channel.send(messageText)
    .then(msg => {
      //msg.pin();
      for (let i in options) {
        i = Number(i);
        if (customoji) msg.react(customojiList[i]);
        else msg.react(emoji.numbers[i+1]);
      }
    });
    console.log(`poll created in ${channel.name} by ${message.member.displayName}`);

  },

  listPolls () {
    return;
  },

  makeSimpPoll(text,channel) {
    channel.send(text)
    .then(msg => {
      msg.react(emoji.thumbsup);
      msg.react(emoji.thumbsdown);
      msg.react(emoji.shrug);
    })
    console.log(`simple poll created in ${channel.name}`)
  }
}

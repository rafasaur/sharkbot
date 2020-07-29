// polls.js

const config = require('./../resources/config.json');
const helpers = require('./../resources/helpers.js');
const emoji = require(`./../resources/emoji.js`);
let activePolls = [];

module.exports = {
  name: "polls",
  aliases: ["poll"],
  description: "for polling",

  help(message,args){
    let reply = `Expected use of polls is \`${config.prefix}poll ` +
      "{description of poll} [option 1] [option 2] [etc]\`, and " +
      "I'll fill in yes/no/maybe if you don't provide options!";
    message.channel.send(reply);
  },

  execute (message,args) {
    // expected format: !poll {description} [option1] [option2] [option3] [etc...]

    if (args[0] === "list") this.list(message.channel);

    else this.addPoll(message,message.channel)

  },

  addPoll (message, channel) {
    const info = message.content.match(/\{([^\}]+)\}/g);
    const description = info[0].slice(1,-1);
    let messageText = "**POLL:** "+description+'\n';

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
      activePolls += msg.url;
      }
    });
    console.log(`poll created in ${channel.name} by ${message.member.displayName}`);

  },

  list (channel) {

    return;
  },

  async makeSimpPoll(text,channel) {
    const msg = await channel.send(text);
    await msg.react(emoji.thumbsup);
    await msg.react(emoji.thumbsdown);
    await msg.react(emoji.shrug);
    activePolls += msg.url;

    console.log(`simple poll created in ${channel.name}`);
  }
}

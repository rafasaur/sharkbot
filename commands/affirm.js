module.exports = {
	name: 'affirm',
	description: 'affirm your friends!',
	execute(message, args, config) {
    if (message.mentions.members.array().length > 0){
      message.mentions.members
        .each(member => member.send("You\'re great and I love you!"))
        .each(member => console.log(`Member ${member.displayName} affirmed!`));
    }
    else {
      message.member.send("You\'re great and I love you!");
      console.log(`Member ${message.member.displayName} affirmed!`);
    message.react('❤️')
    }
  },
};

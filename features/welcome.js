// welcome.js

const fs = require('fs');
const config = require(`./../resources/config.json`);

module.exports = {
  name: "welcome",

  sendMessage (member) {
    // check if the person "smoothed" themself
    let smoothed = JSON.parse(fs.readFileSync(`./resources/smoothers.json`,'utf8'));
    if (member.user.id in smoothed) {
      member.send("Welcome back!");
      console.log(`${member.displayName} is rough once more!`)
      smoothWelcome(member,smoothed);
    }

    //
    else welcomeWelcome(member);
  }
}

function smoothWelcome (member, smoothed) {

  const returnKing = smoothed[member.user.id]
  // add back each role that isn't @everyone
  console.log(`adding roles...`)
  for (const roleID of smoothed[member.user.id].roles) {
    if (roleID !== config.commands.smooth.ignoreID) {
      console.log(`role ID = ${roleID}`);
      try {
        const role = member.guild.roles.cache.find(role => role.id === roleID);
        member.roles.add(role)
        .then(console.log(`\trole ${role.name} added`));
      } catch (error) {console.error(error);}
    }
  }

  // set nickname
  if (smoothed[member.user.id].nickname) {
    member.setNickname(smoothed[member.user.id].nickname);
    console.log(`nickname set!`);
  }

  // and remove them from the smoothed log
  delete smoothed[member.user.id];
  setTimeout( function(){
    fs.writeFileSync(`./resources/smoothers.json`,JSON.stringify(smoothed));
    console.log(`welcome back ${member.displayName}!`);
	},1000);
}


function welcomeWelcome (member) {
  const pronouns = fs.readFileSync(`./resources/pronouns.txt`,'utf8').replace(/\n|\r|\t/g,'').split(' ');
  const prefix = JSON.parse(fs.readFileSync(`./resources/config.json`,'utf8')).prefix;
  let pronounList = `>>> `;
  for (pn of pronouns) pronounList += pn + '\n';

  member.send("Hi! Welcome to the Tank!\n" +
    "In order to Be Excellent to Each Other we request that you "+
    "assign yourself the pronouns you use! You can do this by sending "+
    `\`${prefix}<your pronoun here>\` (e.g.: \`${prefix}she/they\`) `+
    `in any of the channels (but preferably #bot-talk).\n` +
    "If the pronouns you use have not yet been added, " +
    "please message one of the mods and they will add it for you!\n" +
    "Currently, the following pronouns are available:\n" + pronounList +
    "Once again, welcome! We're so glad you're here. "+
    "Tanks for the memories!");
  console.log(`Welcome message sent to ${member.displayName}`);
}

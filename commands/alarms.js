// alarm-clock.js

const fs = require('fs');
const config = require('./../resources/config.json')
var schedule = require('node-schedule');
var moment = require('moment-timezone');

const dayList = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
const shortDayList = ["sun","mon","tue","wed","thu","fri","sat"];

const reminderFiles = fs.readdirSync('./resources/reminders').filter(file => file.endsWith('.txt'));

let reminderGroup = {};
for (const file of reminderFiles) {
  //console.log(file);
  let reminder = fs.readFileSync(`./resources/reminders/${file}`,'utf8').replace(/\r|\t/g,'').split('\n');
	reminder.pop(); reminderGroup[file.slice(0,-4)] = reminder;
  //console.log(reminder, reminderGroup);
}

module.exports = {
  name: "alarms",
  aliases: ["addalarm"],
  description: "adds an alarm to the list & sets it",
  execute(message,args) {

    let hh, mm, ampm, day, postChannel;
    let zoneOffset = -1; // defaults to central (-1 from eastern)

    args = message.content.split('\n')[0].split(' ');
    // check args for time
    // expecting format: day(s) hh:mm (am/pm) +/-tz
    for (arg of args) {
      if (arg.includes(':')) {
        // pull off hour
        hh = Number(arg.split(':')[0]);
        if (hh < 0 || hh > 23) {
          message.reply(`${hh} is not a valid hour!`);
          return;
        }
        // pull off minute
        mm = Number(arg.split(':')[1]);
        if (mm < 0 || mm > 59) {
          message.reply(`${mm} is not a valid minute!`);
          return;
        }
      }
      // check for am/pm
      else if (arg === 'am' || arg === 'pm') {
        const ampm = arg;
      }
      // check for day
      else if (dayList.includes(arg) || shortDayList.includes(arg)) {
        day = shortDayList.find(elem => elem === arg.substring(0,3));
      }
      // check for timezone (defaults to central, eventually)
      //else if (moment.tz.names().includes(arg)) const timezone = arg;
      else if (arg.includes('+') || arg.includes('-')) {
        zoneOffset += Number(arg);
      }
      // find desired post channel (defaults to message channel)
      else if (message.guild.channels.cache.some(ch => ch.name === arg)) {
        postChannel = arg;
      }

    }

    // update raw time
    if (hhMod) {
      if (hh > 11) {
        message.reply(`your time doesn't make sense!`);
        return;
      }
      else if (hhMod === 'pm') hh += 12;
    }

    hh += zoneOffset; hh %= 24;

    // create alarm
    if (!day) {
      const alarmTime = {hour: hh, minute: mm, day: [new schedule.Range(0,6)]};
      console.log(`since no day was specified, running every day!`);
    }
    else {const alarmTime = {hour: hh, minute: mm, day: day};}

    if (!postChannel) postChannel = message.channel.name;

    // add alarm to alarm file, in case of restart
    const alarm = {
      "id" : nextID,
      "time" : alarmTime,
      "message" : message.content.split('\n')[1],
      "channel" : postChannel
    };

    allAlarms[alarm.id] = alarm;
    nextID += 1;
    fs.writeFileSync(`./resources/alarms.json`,JSON.stringify(allAlarms,null,'\t'));

    // add alarm to service
    this.setAlarm(alarm,message.client);
    console.log('new alarm added & set!');
  },

  async setAlarm (client,alarm) {
    // set an alarm- NOT DONE
    if (alarm.type === 'off') return;

    let time = alarm['time'];
    // convert from central
    time.hour += 1; time.hour %= 24;

    let alarmID = alarm.id;
    if (!alarm.type) alarm.type = "meds";

    // set minute and day if not already, so it won't fire constantly
    if (!time.minute) time.minute = 0;
    if (!time.dayOfWeek) time.dayOfWeek = [0,1,2,3,4,5,6];

    // get the channel to post the alarm in (by id), with meds as default
    let channelName = alarm.channel;
    if (!alarm.channel) channelName = config.commands.alarms["meds-channel"];
    //console.log(channelName);
    const channel = await client.channels.cache.get(channelName);

    // get message from file
    let message = alarm['message'];

    //if the alarm is specific to meds reminders (assuming the default)
    if (alarm.type === "meds") {
      //console.log(alarm.id);
      // pick out the role of remindees
      const atrole = channel.guild.roles.cache.find(role => role.id === config.commands.alarms["meds-role"]);
      message = `${atrole} ` + message;
    }

    // schedule message - this should be stored so it can be deleted!
    let newSchedule = schedule.scheduleJob({hour: time.hour, minute: time.minute,
                        dayOfWeek: time.dayOfWeek}, function(){
      if (alarm.type === "meds" && reminderGroup[alarmID]) {
        //console.log(`picking random message...`)
        const thisMessages = reminderGroup[alarmID];
        const atrole = channel.guild.roles.cache.find(role => role.id === config.commands.alarms["meds-role"]);
        let randMsg = thisMessages[Math.floor(Math.random() * thisMessages.length)];
        message = `${atrole} ` + randMsg;
      }
      channel.send(message);
    });

    //client.alarms.set(alarm.name,newSchedule)

    //console.log(`New alarm set for channel ${channel.name}. Message reads: ${message}\n`);
  },

};

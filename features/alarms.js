// alarm-clock.js

let alarms =

module.exports = {
  addAlarm;

};

let addAlarm = {
  name: "addalarm",
  description: "adds an alarm to the list",
  execute(message,args) {
    // check args for time

    // add alarm to alarm file, in case of restart

    // add alarm to service
    setAlarm(message,time);
    console.log('new alarm added & set!')
  },

};

function setAlarm (message,channel,time,id) {
  //
  var newSchedule = schedule.scheduleJob({hour: time.hour, minute: time.minute,
                      dayOfWeek: time.dayOfWeek}, function(){
    channel.send(message);
    console.log('time for tea!');
  });

  let newAlarm = {
    id: id,
    time: time,
    channel: channel,
    message: message
  }
  client.alarms.set(id,newAlarm);
  console.log(`new alarm set, w/ id ${id}. Message reads: ${message}`);
}

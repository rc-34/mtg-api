// set variables for environment
var CronJob = require('cron').CronJob;
var moment = require('moment-timezone');

var job = new CronJob({
	cronTime: '00 05 */1 * * *', onTick: function() { // every hour at HH:05
	// cronTime: '00 05 0,3,6,12,18 * * *', onTick: function() {
	var timeParis = moment().tz("Europe/Paris");
	var timeUTC = moment().tz("UTC");
	console.log( "Cron action at DATE -- UTC :" + timeUTC.format('MMMM Do YYYY, h:mm:ss a') + 
		" -- Paris : " + timeParis.format('MMMM Do YYYY, h:mm:ss a'));

	// Find out latest data set committed, i.e. the most recent referencetime
	// If it is not newer, do nothing
	// Else download it, store it in the temporary target directory
	// http://dcpc-nwp.meteo.fr/services/PS_GetCache_DCPCPreviNum?token=__5yLVTdr-sGeHoPitnFc7TZ6MhBcJxuSsoZp6y0leVHU__&model=AROME&grid=0.01&package=HP1&time=02H&referencetime=2016-02-03T03:00:00Z
	// Convert the new data set to ncdf format
	// Link temporary directory as the up to date data set, and place the former data set as back up (keep 1 data set back, erase others)
	// Register to thredds ?

	}, start: false, timeZone: 'UTC'});


// export functions
module.exports = {
  start: function () {
  	try {
  		job.start();
  		console.log("Cron has been launched!");
  	} catch (ex) {
  		console.log("Error while launching cron" + "\n" + "Error:"+ ex);
  	}
  }
};
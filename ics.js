// Takes a list of events and returns them formatted as an ics string
// suitable for import in e.g. google calendar

var moment = require('moment');

module.exports = function(events) {
	
	var output = "BEGIN:VCALENDAR\nVERSION:2.0\n";
	output += "PRODID:-//Thomas Haukland//ics.js v1.0//EN\n";
	// Timezone
	output += 
`BEGIN:VTIMEZONE
TZID:Europe/Oslo
X-LIC-LOCATION:Europe/Oslo
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
`

	events.forEach(function(event) {
		output += "BEGIN:VEVENT\n";
		output += "UID:" + event.uid + "\n";
		output += "DTSTART:" + getIcsDate(event.start) + "\n";
		output += "ORGANIZER:" + event.organizer + "\n";
		output += "DTEND:" + getIcsDate(event.end) + "\n";
		output += "SUMMARY:" + event.summary + "\n";
		output += "DESCRIPTION:" + event.description + "\n";
		output += "URL:" + event.url + "\n";
		output += "LOCATION:" + event.location + "\n";
		output += "END:VEVENT\n";
	});

	output += "END:VCALENDAR";

	return output;
}

function getIcsDate(aDate) {
	return moment(aDate).utc().format("YYYYMMDDTHHmmss") + "Z";
}

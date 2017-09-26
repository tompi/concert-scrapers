// Takes a list of events and returns them formatted as an ics string
// suitable for import in e.g. google calendar
module.exports = function(events) {
	
	var output = "BEGIN:VCALENDAR\nVERSION:2.0";
	output += "\nPRODID:-//Thomas Haukland//ics.js v1.0//EN\n";

	events.forEach(function(event) {
		output += "BEGIN:VEVENT\n";
		output += "UID:" + event.uid + "\n";
		output += "DTSTART:" + getIcsDate(event.start) + "\n";
		output += "ORGANIZER:" + event.organizer + "\n";
		output += "DTEND:" + getIcsDate(event.end) + "\n";
		output += "SUMMARY:" + event.summary + "\n";
		output += "URL:" + event.url + "\n";
		output += "LOCATION:" + event.location + "\n";
		output += "END:VEVENT\n";
	});

	output += "END:VCALENDAR";

	return output;
}

// Copied from https://stackoverflow.com/questions/25389438/converting-a-date-in-an-invalid-javascript-format-to-an-ics-standard-datetime-fi
function getIcsDate(aDate) {
	var pre = aDate.getFullYear().toString() +
			((aDate.getMonth() + 1)<10? "0" + 
			(aDate.getMonth() + 1).toString():(aDate.getMonth() + 1).toString()) + 
			((aDate.getDate() + 1)<10? "0" + 
			aDate.getDate().toString():aDate.getDate().toString());

	var post = (aDate.getHours()%12).toString() + 
						aDate.getMinutes().toString() + "00";

	return pre + "T" + post;
}

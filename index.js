var request = require('request');
var moment = require('moment');
/*
request.post(
  ' http://www.stavanger-bluesclub.no/apps/appBuilder/1/viewer/GetAppPartData',
  {json: {"applicationInstanceId":"13ed2460-abc7-0ffa-a214-15d78fa2259e","appPartIds":["apppartibne59xm12"],"itemIds":[]}},
  function (error, response, body) {
	  if (error) {
	    console.log(error);
	  } else if (response.statusCode == 200) {
      console.log(JSON.stringify(body));
    } else {
	  console.log(response.statusCode);
	}
});
*/

var testdata = require('./testdata.json');

console.log(parseBlues(testdata));

function parseBlues(data) {
	return data.payload.items.map(mapConcert);
}

function mapConcert(concert) {
	return {
		uuid: concert._iid,
		name: parseTitle(concert.title),
		date: parseDate(concert.ibnf19h1),
		place: 'Dickens, Stavanger',
		url: 'http://www.stavanger-bluesclub.no/events-2/' + concert._iid,
	  organizer: 'Stavanger Bluesklubb'
  };
}

function parseTitle(title) {
	return title.split(' - ')[0];
}

function parseDate(dateString) {
	var parts = dateString.toLowerCase().replace(' ', '').split('kl');
  var datePart = parts[0];
	var timePart = parts[1].replace(/[^0-9]/g, '').substr(0, 4);
	return moment(datePartToIso(datePart) + 'T' + timePartToIso(timePart));
}

function timePartToIso(timeString) {
	return timeString.substring(0,2) + ':' + timeString.substring(2,4);
}

function datePartToIso(datePartString) {
	var parts = datePartString.split('.');

	var year = parts[2];
	if (year.length === 2) year = '20' + year;
	return year + '-' + parts[1] + '-' + parts[0];
}

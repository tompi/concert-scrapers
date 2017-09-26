var request = require('request');
var moment = require('moment');
var ics = require('./ics.js');
var requireText = require('require-text');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

/*
request.get(
  'http://stavangerjazzforum.no/konserter/',
  function (error, response, body) {
	  if (error) {
	    console.log(error);
	  } else if (response.statusCode == 200) {
      console.log(body);
    } else {
	  console.log(response.statusCode);
	}
});
*/

var testdata = requireText('./jazz-testdata.html', require);
console.log(parseJazz(testdata));
//console.log(ics(parseBlues(testdata)));

function parseJazz(html) {
	var dom = new JSDOM(html);
	var nyeKonserter = dom.window.document.querySelector("#concerts_container");
}

function mapConcert(concert) {
	var start = parseDate(concert.ibnf19h1);
	return {
		uid: 'stav-blues-' + concert._iid,
		summary: parseTitle(concert.title),
		description: concert["wxRchTxt_sTxt4-ut6"].text.replace(/\r?\n|\r/g,''),
		start: start.toDate(),
		end: start.add(3, 'hours').toDate(),
		location: 'Dickens, Stavanger',
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

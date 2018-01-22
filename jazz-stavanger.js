const request = require('request');
const moment = require('moment');
const ics = require('./ics.js');
const requireText = require('require-text');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const year = (new Date()).getFullYear();

request.get(
  'http://stavangerjazzforum.no/konserter/',
  // 'http://maijazz.no/konserter/',
  function (error, response, body) {
	  if (error) {
	    console.log(error);
	  } else if (response.statusCode === 200) {
      console.log(ics(parseJazz(body)));
    } else {
	  console.log(response.statusCode);
	}
});

// Debug:
//let testdata = requireText('./jazz-testdata.html', require);
//console.log(parseJazz(testdata));

function parseJazz(html) {
	let dom = new JSDOM(html);
	let nyekonserterNode = dom.window.document.querySelector("#concerts_container");
	let konsertListe = Array.prototype.slice.call(nyekonserterNode.querySelectorAll(".row-kons"));
	return konsertListe.map(mapConcert);
}

function mapConcert(concert) {
	let datoNode = concert.querySelectorAll(".col-xs-2 span");
  // Første span inneholder dato, andre klokke
	let dato = parseDate(datoNode[0].innerHTML, datoNode[1].innerHTML);
  let tittel = concert.querySelector(".text-wrap").innerHTML;
  let sted = concert.querySelector(".js_venue").innerHTML;
  let info = concert.querySelector(".konsert-listing-btns-column").innerHTML.replace(/\r?\n|\r/g,'');

	return {
		uid: 'stav-jazz-' + dato.toISOString(),
		summary: tittel,
		description: info.replace('  ', '').replace('\t', '').trim(),
    start: dato.toDate(),
		end: dato.add(3, 'hours').toDate(),
		location: sted,
    organizer: 'Stavanger Jazzforum'
  };
}

function parseDate(dateString, timeString) {
	let parts = dateString.toLowerCase().trim().split('. ');
  let month = getMonth(parts[1]);
  let day = parts[0];
  if (day.length === 1) day = '0' + day;
  let parsedDateString = year + '-' + month + '-' + day + 'T' + timeString;
  //console.log(parsedDateString);
	return moment(parsedDateString);
}

function getMonth(month) {
	switch (month.substr(0, 3)) {
    case 'jan':
      return '01';
    case 'feb':
      return '02';
    case 'mar':
      return '03';
    case 'apr':
      return '04';
    case 'mai':
      return '05';
    case 'jun':
      return '06';
    case 'jul':
      return '07';
    case 'aug':
      return '08';
    case 'sep':
      return '09';
    case 'okt':
      return '10';
    case 'nov':
      return '11';
    case 'des':
      return '12';
    default:
      throw new Error("Unknown month: " + month);
  }
}

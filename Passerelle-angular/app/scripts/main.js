// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/* global $:false */
'use strict';

var calendarOptions = function(index){
	return {
	    language: 'fr',
	    cell_border: true,
  		today: true,
	    legend: [
	        {type: 'text', label: 'Fermeture', badge: '12'},
	        {type: 'block', label: 'Réservation'}
	    ],
	    ajax: {
	        url: 'http://209.122.232.103:8090/calendar/'+index,
	        modal: true
	    }
	};
};

$(document).ready(function () {
	$('#datepicker0').zabuto_calendar(calendarOptions(0));
	$('#datepicker1').zabuto_calendar(calendarOptions(1));
	$('#datepicker2').zabuto_calendar(calendarOptions(2)); 
}); 
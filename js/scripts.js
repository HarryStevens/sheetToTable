function loading(button) {

	var parents = $(button).parents();
	var contexts = parents[0];

	for (var i = 0; i < parents.length; i++) {
		var currParent = $(parents[i]);
		var context = currParent[0];
		var classes = $(context).attr('class');
		if ( typeof classes != 'undefined') {
			if (classes.indexOf('step-') > -1) {
				var step = (classes.split('step-')[1]).split(' ')[0];
			}
		}
	}

	var newStep = Number(step) + 1;

	$('.step').css({
		'opacity' : '0',
		'margin-left' : '-100000px'
	});
	$('.step-' + newStep).css({
		'opacity' : '1',
		'margin-left' : '0px'
	});

}

function drawTable(data, headers) {
	
	$('#data-table').append('<thead><tr></tr></thead><tfoot><tr></tr></tfoot>');
	for (var i = 0; i < headers.length; i++) {

		$('#data-table thead tr').append('<th>' + headers[i] + '</th>');
		$('#data-table tfoot tr').append('<th>' + headers[i] + '</th>');
	}

	$('#data-table').append('<tbody></tbody>');

	for (var j = 0; j < data.length; j++) {

		var nthType = Number(j)+1;
		
		var currRow = data[j];
		
		$('#data-table tbody').append('<tr></tr>');
		
		for (var k=0;k<headers.length;k++){
			var currHeader = headers[k];
			var td = currRow[currHeader];
			
		 	$('#data-table tbody tr:nth-of-type('+Number(nthType)+')').append('<td>'+td+'</td>');	
		}

	}
	
	$('#data-table').DataTable();

}

function structureData(headers, data) {

	var gsxHeaders = [];

	for (var i = 0; i < headers.length; i++) {
		var header = headers[i];
		var gsxHeader = 'gsx$' + header;
		gsxHeaders.push(gsxHeader);
	}
	var dataArray = [];
	for (var j = 0; j < data.length; j++) {
		var currRow = data[j];

		var target = {

		};

		for (var k = 0; k < gsxHeaders.length; k++) {
			var currObject = {

			};

			var currGsx = gsxHeaders[k];
			var header = headers[k];
			var val = currRow[currGsx].$t;
			currObject[header] = val;
			Object.assign(target, currObject);

		}
		dataArray.push(target);

	}

	drawTable(dataArray, headers);

}

function chooseColumns(columns, data) {

	for (var i = 0; i < columns.length; i++) {
		$('.checkbox-wrapper').append('<div class="checkbox"><label><input type="checkbox" name="column" value="' + columns[i] + '">' + columns[i] + '</label></div>');
	}

	$('.step-2 button').click(function() {
		var $boxes = $('input[name=column]:checked');

		var headers = []

		for (var i = 0; i < $boxes.length; i++) {
			var currBox = $boxes[i]
			var value = $(currBox).attr('value');
			headers.push(value);
		}
		structureData(headers, data);

		var button = $(this);
		loading(button);

	});

}

function getData(url) {
	$.getJSON(url, function(results) {

		var data = results.feed.entry;
		var keys = Object.keys(data[0]);
		var columns = [];
		for (var i = 0; i < keys.length; i++) {
			var currKey = keys[i];
			if (currKey.indexOf('gsx$') > -1) {
				var cleanKey = currKey.split('gsx$')[1];
				columns.push(cleanKey);
			}
		}

		chooseColumns(columns, data);
	});
}

function processURL(url) {

	var id = (url.split('/d/')[1]).split('/')[0];
	var newURL = 'https://spreadsheets.google.com/feeds/list/' + id + '/default/public/values?alt=json-in-script&callback=?';

	getData(newURL);

}

function submitURL() {

	$('.submit-url-wrapper button').click(function() {

		var url = $('.submit-url-input').val();
		processURL(url);

		var button = $(this);

		loading(button);

	});

}


$(document).ready(function() {
	$('.step').css({
		'opacity' : '0',
		'margin-left' : '-100000px'
	});
	$('.step-1').css({
		'opacity' : '1',
		'margin-left' : '0px'
	});
	submitURL();

});

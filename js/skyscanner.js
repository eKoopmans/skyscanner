var skyscanner = (function() {
	var ss = {};
	var apiKey = '';
	var market = 'CA', currency = 'CAD', locale = 'en-US';
	var places = [];
	
	// Helper functions
	function strFormat(str, data) {
		// Using keys, fill data into str
		for (var key in data)
			str = str.replace(new RegExp('{'+key+'}', 'g'), data[key]);

		// Return the formatted string
		return str;
	}
	function create(dest, htmlStr) {
		// Get the DOM if dest is a string
		if (typeof(dest) === 'string') {
			dest = document.getElementById(dest);
		}

		// Append DOM children one at a time, storing links to each
		var obj = [], temp = document.createElement('div');
		temp.innerHTML = htmlStr.trim();
		while (temp.firstChild) {
			obj.push( dest.appendChild(temp.firstChild) );
		}

		// Remove the list layer for unary objects
		if (obj.length == 1)
			obj = obj[0];

		// Return the created objects
		return obj;
	}
	
	// Getters/setters
	ss.setApiKey = function(key) {
		return apiKey = key;
	}
	ss.getApiKey = function() {
		if (!apiKey)	throw "You must provide an API key with skyscanner.setApiKey()."
		return apiKey;
	}

	// Main Skyscanner functions
	ss.getLocation = function(fcn, query) {
		// NOTE: Requires apiKey, market, currency, locale to be set globally

		// Collect the query data
		//var getData = {query: query, apiKey: ss.getApiKey()};
		var getQuery = 'query=' + query;
		var data = {market:market, currency:currency, locale:locale};

		// Create the GET url
		var url = 'http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/{market}/{currency}/{locale}/';
		url = strFormat(url, data);

		// Send the request
		var headers = ['Accept: application/json'];
		webproxy(url, fcn, {method: 'GET', query: getQuery, header: headers});
	}

	ss.getQuote = function(fcn, originPlace, destinationPlace, outboundPartialDate, inboundPartialDate='') {
		// NOTE: Requires apiKey, market, currency, locale to be set globally

		// Collect the query data
		//var getData = {apiKey: ss.getApiKey()};
		var getQuery = 'apiKey=' + ss.getApiKey();
		var data = {market:market, currency:currency, locale:locale, originPlace:originPlace, destinationPlace:destinationPlace, outboundPartialDate:outboundPartialDate, inboundPartialDate:inboundPartialDate};

		// Create the GET url
		var url = 'http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/{market}/{currency}/{locale}/{originPlace}/{destinationPlace}/{outboundPartialDate}/{inboundPartialDate}';
		url = strFormat(url, data);

		// Send the request
		var headers = ['Accept: application/json'];
		webproxy(url, fcn, {method: 'GET', query: getQuery, header: headers});
	}

	// Object declarations
	ss.Place = function(dest=document.body) {
		// Keep a list of all place objects
		this.i = places.length;
		places.push(this);

		// Create the DOM element
		var str = '<div class="search"><input type="text" placeholder="Search..." />' +
			'<ul class="results"></ul></div>';
		this.dom = create(dest, str);

		// Keep track of links to the DOM objects
		this.domSearch = this.dom.firstChild;
		this.domList = this.dom.lastChild;

		// Add a listener for when the search field changes
		// 'bind' changes the function's 'this' context object
		// Also look into 'call' and 'apply' (for calling functions)
		this.domSearch.addEventListener('input', this.updateSearch.bind(this), false);
		this.domSearch.addEventListener('click', function() {this.setSelectionRange(0,this.value.length);}, false);
	//	this.domSearch.addEventListener('click', function() {this.select();}, false);

		// Set a default search item and populate the search list
		this.id = 'anywhere';
		this.list = ['Anywhere'];
		this.updateList();
	}
	ss.Place.prototype.updateSearch = function() {
		var query = this.domSearch.value;
		// *** MAY WANT TO DEFAULT TO 'ANYWHERE' ANY TIME THEY TYPE NEW STUFF? *** //
		//this.id = 'anywhere';
		ss.getLocation(this.updateList.bind(this), query);
	}
	ss.Place.prototype.updateList = function(data=null) {
		// Parse the data
		data = (data==null || data.Places==null ? [] : data.Places)

		// Add 'Anywhere' to all search results
		data.push({CityId: '', CountryId: '', CountryName: '', PlaceId: 'anywhere', PlaceName: 'Anywhere', RegionId: ''});

		// Store the results and initialize the list of places
		this.searchResults = data;
		this.list = [];
		var listHTML = '', thisPlace;

		// Build a list of all place results
		for (var i=0; i<data.length; i++) {
			// Add country and place name together
			if (data[i].CountryName && data[i].PlaceName != data[i].CountryName)
				thisPlace = data[i].PlaceName + ', ' + data[i].CountryName;
			else
				thisPlace = data[i].PlaceName;

			// Add this place onto the list
			this.list.push(thisPlace);
			listHTML += strFormat('<li><a data-i="{i}">{thisPlace}</a></li>', {i: i, thisPlace: thisPlace});
		}

		// Update the list (could instead delete all children and then use create)
		this.domList.innerHTML = listHTML;

		// Add listeners
		var children = this.domList.children;
		for (var i=0; i<children.length; i++) {
			children[i].firstChild.addEventListener('click', this.updateValue.bind(this), false);
		}
	}
	ss.Place.prototype.updateValue = function(event) {
		// Set the selection and update the search results
		var i = event.target.dataset.i;
		this.domSearch.value = this.list[i];
		this.updateSearch();

		// Hide (then unhide again) the dropdown list
		var listStyle = this.domList.style;
		listStyle.display = 'none';
		setTimeout(function() {listStyle.display = ''}, 50);

		// Set the chosen ID
		this.id = this.searchResults[i].PlaceId;
	}
	
	// Expose the ss object
	return ss;
}());

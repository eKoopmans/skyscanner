# SkyscannerJS

SkyscannerJS is a JavaScript frontend to interact with the Skyscanner flight search API.

This is a work-in-progress, and currently only exposes:

1. `skyscanner.setApiKey` and `skyscanner.getApiKey`: Set and get the API key to use when querying Skyscanner (required for most queries).
2. `skyscanner.getLocation`: Query the [Skyscanner Location Autosuggest Service](http://business.skyscanner.net/portal/en-GB/Documentation/Autosuggest) to get an array of locations matching a search string.
3. `skyscanner.getQuote`: Query the [Skyscanner Browse Quotes Service](http://business.skyscanner.net/portal/en-GB/Documentation/FlightsBrowseCacheQuotes) to get the cheapest quote for a given route.
4. `skyscanner.Place`: A class that creates an auto-complete location search box, by querying `skyscanner.getLocation` when the input field is changed.

## Install

1. Copy the `css`, `js`, and `lib` directories to your project directory.
2. Include `<script src="js/skyscanner.js"></script>` in your HTML document.

## Usage

Please see `index.html` and the source code (`skyscanner.js`) for usage examples.

## Credits

- [Erik Koopmans](https://github.com/eKoopmans)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Erik Koopmans <[http://www.erik-koopmans.com/](http://www.erik-koopmans.com/)>

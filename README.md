# Sam Movie App

React Chakra

Builds on what I learnt after building SamTFLApp. This is the second time using React for me, SamTFLApp being the first.

## What does it do?

Uses OMDB API to make searches on movie data, will store everything user does to local storage to create autocompletes and if the user clicks on a movie for more information, that will be stored so there arent any unnecessary API calls.

When the user searches using local data only, they can filter the results by genre. Searching with an empty search box is the easiest way of seeing this in action.

## To run

1. Obtain a API key from OMDb

2. Place your API key in my-movie-app/.env.local like so `REACT_APP_OMDB_KEY=your_api_key`

3. `cd my-movie-app`

* `npm start` Starts the development server.

* `npm run build` Bundles the app into static files for production.

## TODO
* Errors are reported to console, but not shown visually to user. (Try searching "the" and the api responds with an error as otherwise it would return too many results.)
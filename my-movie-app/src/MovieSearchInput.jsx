import { Button, Checkbox, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const MovieSearchInput = ({ searchTerm, onSearchTermChange, onSearchTitle, onSearch, onCheckboxChange }) => {
  const localData = JSON.parse(localStorage.getItem('localData')) || [];
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [localSearchOnly, setLocalSearchOnly] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const localDetailedData = JSON.parse(localStorage.getItem('localDetailedData')) || [];
  const genres = new Set();

  localDetailedData.forEach((item) => {
    const itemGenres = item.Genre.split(',').map((genre) => genre.trim());
    itemGenres.forEach((genre) => genres.add(genre));
    //console.info(genres)
  });
  const genresArray = Array.from(genres);

  const handleAutocomplete = (e) => {
    const input = e.target.value;
    const suggestions = localData.filter((item) =>
      item.Title.toLowerCase().includes(input.toLowerCase())
    );
    setAutocompleteSuggestions(suggestions);
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setLocalSearchOnly(isChecked);
    onCheckboxChange(isChecked); // Call the callback function with the checkbox state
    //TODO : set selectedgenres to empyty
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchTermChange({ target: { value: suggestion.Title } }); // Fill the search box with the selected text
  };

  /**
   * 
   * @param {*} e the event object
   * @param {*} genre the genre associated with the checkbox
   */
  const handleGenreCheckboxChange = (e, genre) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedGenres((prevSelectedGenres) => [...prevSelectedGenres, genre]);
    } else {
      setSelectedGenres((prevSelectedGenres) =>
        prevSelectedGenres.filter((selectedGenre) => selectedGenre !== genre)
      );
    }
    console.info(selectedGenres)
  };

  return (
    <Flex direction='column' gap='5px'>
      <input
        type="text"
        value={searchTerm}
        onChange={onSearchTermChange}
        onInput={handleAutocomplete}
        placeholder="Enter movie title"
      />
      <Button onClick={onSearchTitle}>Search Title</Button>
      <Button onClick={onSearch}>Search</Button>
      <Checkbox onChange={handleCheckboxChange}>Local Search Only</Checkbox>
      {//Need to do a genre filter if local search is on...
      }
      <ul>
        {localSearchOnly ? (
          genresArray.map((genre) => (
            <li key={genre}>
              <Checkbox onChange={(e) => handleGenreCheckboxChange(e, genre)}>
                {genre}
              </Checkbox>
            </li>
          )
        )
        ): (null)}
      </ul>
      {autocompleteSuggestions.length > 0 && (
      <ul>
        {autocompleteSuggestions.map((suggestion) => (
          <li key={suggestion.imdbID} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion.Title}
          </li>
        ))}
      </ul>
    )}
    </Flex>
  );
};

export default MovieSearchInput;

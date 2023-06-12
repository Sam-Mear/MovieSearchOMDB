import { Button, Checkbox, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const MovieSearchInput = ({ searchTerm, onSearchTermChange, onSearchTitle, onSearch, onCheckboxChange }) => {
  const localData = JSON.parse(localStorage.getItem('localData')) || [];
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);

  const handleAutocomplete = (e) => {
    const input = e.target.value;
    const suggestions = localData.filter((item) =>
      item.Title.toLowerCase().includes(input.toLowerCase())
    );
    setAutocompleteSuggestions(suggestions);
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    onCheckboxChange(isChecked); // Call the callback function with the checkbox state
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
      {autocompleteSuggestions.length > 0 && (
      <ul>
        {autocompleteSuggestions.map((suggestion) => (
          <li key={suggestion.imdbID}>{suggestion.Title}</li>
        ))}
      </ul>
    )}
    </Flex>
  );
};

export default MovieSearchInput;

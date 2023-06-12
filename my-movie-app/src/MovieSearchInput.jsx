import { Button, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const MovieSearchInput = ({ searchTerm, onSearchTermChange, onSearchTitle, onSearch }) => {
  const localData = JSON.parse(localStorage.getItem('localData')) || [];
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);

  const handleAutocomplete = (e) => {
    const input = e.target.value;
    const suggestions = localData.filter((item) =>
      item.Title.toLowerCase().includes(input.toLowerCase())
    );
    setAutocompleteSuggestions(suggestions);
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

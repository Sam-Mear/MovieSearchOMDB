import { Button, Flex } from '@chakra-ui/react';
import React from 'react';

const MovieSearchInput = ({ searchTerm, onSearchTermChange, onSearchTitle, onSearch }) => {
  return (
    <Flex direction='column' gap='5px'>
      <input
        type="text"
        value={searchTerm}
        onChange={onSearchTermChange}
        placeholder="Enter movie title"
      />
      <Button onClick={onSearchTitle}>Search Title</Button>
      <Button onClick={onSearch}>Search</Button>
    </Flex>
  );
};

export default MovieSearchInput;

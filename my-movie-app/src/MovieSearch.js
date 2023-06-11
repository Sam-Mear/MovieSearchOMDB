import React, { useEffect, useState } from 'react';
import {
  Card,
    CardHeader,
    ChakraProvider,
    Flex,
    Image,
    Text,
    Box
  } from '@chakra-ui/react';
import MovieSearchInput from './MovieSearchInput';
import MovieDetails from './MovieDetails';


export const MovieSearch = () => {
  const [movieData, setMovieData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovieData = async () => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.REACT_APP_OMDB_KEY}`);
      //search is s=
      //then use search results to get id, then use i= for that
      //t= is just by title.
      const data = await response.json();
      setMovieData(data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const handleSearch = () => {
    fetchMovieData();
  };

  return (
    <Box>
      <MovieSearchInput
        searchTerm={searchTerm}
        onSearchTermChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
      />
      <Flex>
        <Card>
          {movieData ? (
            <MovieDetails movieData={movieData} />
          ) : (
            <Text>Loading...</Text>
          )}
        </Card>
      </Flex>
    </Box>
  );
};

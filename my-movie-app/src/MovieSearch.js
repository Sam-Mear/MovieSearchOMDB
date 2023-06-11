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
  const [searchData, setSearchData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovieDataTitle = async () => {
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

  const fetchMovieData = async () => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?s=${searchTerm}&apikey=${process.env.REACT_APP_OMDB_KEY}`);
      //search is s=
      //then use search results to get id, then use i= for that
      //t= is just by title.
      const data = await response.json();
      setSearchData(data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const handleSearchTitle = () => {
    fetchMovieDataTitle();
  };
  const handleSearch = () => {
    fetchMovieData();
  };

  return (
    <Flex>
      <Box>
        <MovieSearchInput
          searchTerm={searchTerm}
          onSearchTermChange={(e) => setSearchTerm(e.target.value)}
          onSearchTitle={handleSearchTitle}
          onSearch={handleSearch}
        />
      </Box>
      <Flex wrap='wrap' gap='5px'>
        <Card minW='20%' flexGrow='999' maxW='50%'>
          {movieData ? (
            <MovieDetails movieData={movieData} />
          ) : (
            <Text>Search Title Loading...</Text>
          )}
        </Card>
        {searchData &&
          searchData.Search.map((data) => (
            <Card minW='20%' flexGrow='999' maxW='50%'>
              <MovieDetails movieData={data} />
            </Card>
          ))
        }
      </Flex>
    </Flex>
  );
};

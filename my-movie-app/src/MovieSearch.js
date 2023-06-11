/**
 * 
 * Autocomplete not sure how to do. Plan is to store the movies locally first, then 
 * do the autocomplete on the locally stored data.
 * If user typed: lord, and in local data the lord of the rings was there, it would show up.
 * 
 * For stored data:
 * useEffect(() => {
    const storedData = localStorage.getItem('movieData');
    if (storedData) {
      setMovieData(JSON.parse(storedData));
    }
  }, []);
 * the useEffect hook is used to check if there is any previously stored movie data in localStorage. 
 * If there is, it retrieves the data and sets it as the initial value for movieData. 
 * This ensures that if the user has previously searched for a movie, the data will be loaded from localStorage
 * 
 * and to store it:
 * localStorage.setItem('movieData', JSON.stringify(data));
 * 
 * Maybe each movie will be stored with a date, like a cache, so after 7 days it can be considered dead and would need to be updated.
 * 
 */

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
      // TODO : Needs to check if it successfully return an error before setting the search data.
      // IT also needs remove the unnecessary results (games ect) before it sets the data.
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

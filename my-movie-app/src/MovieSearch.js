/**
 * 
 * Last two more points:
 * 1. The application should be able to filter the list by Genre.
 * 2. When a suggestion is visible in the input, if the user presses 'Right' or
 * 'Tab' key, the input value should autocomplete with the visible suggestion.
 * 
 * 2 might be difficult due to how ive implemented it.
 * 
 * Make more components, so its easier to split the results into 2 categories:
 * 1. Local search - can have plot, ratings and detailed info
 * 2. API search - If the movie isnt in local data.
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
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Heading
  } from '@chakra-ui/react';
import MovieSearchInput from './MovieSearchInput';
import MovieDetails from './MovieDetails';


export const MovieSearch = () => {
  const [movieData, setMovieData] = useState(null);
  const [localData, setLocalData] = useState(null);
  const [localDetailedData, setLocalDetailedData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [modalMovieData, setModalMovieData] = useState(null); // Track data for the modal
  const [localSearchOnly, setLocalSearchOnly] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('localData');
    if (storedData) {
      setLocalData(JSON.parse(storedData));
    }
    const storedDetailedData = localStorage.getItem('localDetailedData');
    if (storedDetailedData) {
      setLocalData(JSON.parse(storedDetailedData));
    }
  }, []);

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
      const data = await response.json();
      let filteredData = data.Search.filter(item => item.Type === 'movie');
      setSearchData(filteredData);
      // Storing the data locally in localStorage
      if (localData != null) {
        localData.forEach(localMovie => {
          filteredData.forEach(searchMovie => {
            if (localMovie.imdbID === searchMovie.imdbID) {
              filteredData = filteredData.filter(movie => movie.imdbID !== searchMovie.imdbID);
            }
          });
        });
      }
      //storing it in a temp variable fixes the local storage not being updated until the search after for whatever reason.
      const temp = localData ? localData.concat(filteredData) : filteredData
      setLocalData(temp)
      localStorage.setItem('localData', JSON.stringify(temp));
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const handleSearchTitle = () => {
    fetchMovieDataTitle();
  };
  const handleSearch = () => {
    if (localSearchOnly){
      const localData = JSON.parse(localStorage.getItem('localDetailedData')) || [];
      const results = localData.filter((item) =>
        item.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchData(results)
    }else{
      fetchMovieData();
    }
  };

  /**
   * Handles a search result click.
   * @param {*} imdbID 
   */
  const handleCardClick = async imdbID => {
    //Check if its already in memory
    const localData = JSON.parse(localStorage.getItem('localDetailedData')) || [];
    let foundInMemory = false;
    for (const element of localData) {
      if (imdbID === element.imdbID) {
        setModalMovieData(element); // Store the detailed movie data for the modal
        setIsModalOpen(true); // Open the modal
        console.info("FOUND IN MEMORY!")
        foundInMemory = true;
        break;
      }
    }
    if (!foundInMemory) {
      //Its not in local storage, so must be fetched from API
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.REACT_APP_OMDB_KEY}`
        );
        const data = await response.json();
        // Handle the retrieved detailed movie data
        const updatedLocalData = [...localData, data];
        setLocalDetailedData(updatedLocalData)
        localStorage.setItem('localDetailedData', JSON.stringify(updatedLocalData));
        setModalMovieData(data); // Store the detailed movie data for the modal
        setIsModalOpen(true); // Open the modal
      } catch (error) {
        console.error('Error fetching detailed movie data:', error);
      }
    }
  };

  /**
   * Closes modal when exit button is clicked.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  /**
   * will set localSearchOnly accordingly if the checkbox in MovieSearchInput is clicked.
   * @param {*} isChecked 
   */
  const handleCheckboxChange = (isChecked) => {
    setLocalSearchOnly(isChecked);
  };

  const handleSelectedGenresChange = (genres) => {
    setSelectedGenres(genres);
    
  };

  useEffect(() => {
    console.info(selectedGenres)
  }, [selectedGenres]);


  return (
    <>
    <Flex>
      <Box>
        <MovieSearchInput
          searchTerm={searchTerm}
          onSearchTermChange={(e) => setSearchTerm(e.target.value)}
          onSearchTitle={handleSearchTitle}
          onSearch={handleSearch}
          onCheckboxChange={handleCheckboxChange}
          onSelectedGenresChange={handleSelectedGenresChange}
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
          searchData.map((data) => {
            if (selectedGenres.length > 0 ) {
              const itemGenres = data.Genre.split(',').map((genre) => genre.trim());
              if (selectedGenres.some((element) => itemGenres.includes(element))){
              return (
                <Card minW='20%' flexGrow='999' maxW='50%' key={data.imdbID} onClick={() => handleCardClick(data.imdbID)}>
                  <MovieDetails movieData={data} />
                </Card>
              );
              }
            } else if (selectedGenres.length === 0) {
              return (
                <Card minW='20%' flexGrow='999' maxW='50%' key={data.imdbID} onClick={() => handleCardClick(data.imdbID)}>
                  <MovieDetails movieData={data} />
                </Card>
              );
            }
            return null;
          })}
      </Flex>
    </Flex>
    <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Movie Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {modalMovieData ? (
            <>
              <Heading>{modalMovieData.Title}</Heading>
              <Text>Year: {modalMovieData.Year}</Text>
              <Text>Genre: {modalMovieData.Genre}</Text>
              <Text>Director: {modalMovieData.Director}</Text>
              <Text>Actors: {modalMovieData.Actors}</Text>
              <Text>Plot: {modalMovieData.Plot}</Text>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
};

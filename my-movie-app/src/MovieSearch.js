import React, { useEffect, useState } from 'react';
import {
  Card,
    CardHeader,
    ChakraProvider,
    Image,
    Text
  } from '@chakra-ui/react';


export const MovieSearch = () => {
  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(`http://www.omdbapi.com/?t=joker&apikey=${process.env.REACT_APP_OMDB_KEY}`);
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, []);

  if (!movieData) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>{movieData.Title}</CardHeader>
      <Text>{movieData.Plot}</Text>
      <Image src={movieData.Poster}></Image>
      <h2>Debug info below</h2>
      <Text>{movieData.Error}</Text>
      <Text>Your API Key: {process.env.REACT_APP_OMDB_KEY}</Text>
      <Text>The Request Made: {`http://www.omdbapi.com/?t=joker&apikey=${process.env.REACT_APP_OMDB_KEY}`}</Text>
    </Card>
  );
};

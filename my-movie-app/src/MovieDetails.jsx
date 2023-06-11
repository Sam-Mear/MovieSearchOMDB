import React from 'react';
import { CardHeader, Text, Image } from '@chakra-ui/react';

const MovieDetails = ({ movieData }) => {
  return (
    <>
      <CardHeader>{movieData.Title}</CardHeader>
      <Text>{movieData.Plot}</Text>
      <Image src={movieData.Poster} />
      <h2>Debug info below</h2>
      <Text>{movieData.Error}</Text>
    </>
  );
};

export default MovieDetails;

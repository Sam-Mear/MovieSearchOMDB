import React from 'react';

const MovieSearchInput = ({ searchTerm, onSearchTermChange, onSearch }) => {
  return (
    <>
      <input
        type="text"
        value={searchTerm}
        onChange={onSearchTermChange}
        placeholder="Enter movie title"
      />
      <button onClick={onSearch}>Search</button>
    </>
  );
};

export default MovieSearchInput;

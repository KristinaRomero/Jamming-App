import React, { useState } from "react";


function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle the search submission
  const handleSearch = () => {
    onSearch(searchTerm); // Trigger the search with the current search term
  };

  // Function to handle input changes
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // Update the state with the input value
  };

  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder="Enter a song, album, or artist"
        value={searchTerm}
        onChange={handleInputChange}
        id="search-bar" // Add this
        name="searchTerm" // And this
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;

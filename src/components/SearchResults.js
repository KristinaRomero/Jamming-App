import React from "react";
import Track from "./Track";

function SearchResults({ searchResults, onAdd }) {
  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      {searchResults.map((track) => (
        <Track key={track.id} track={track} onAdd={onAdd} isRemoval={false} />
      ))}
    </div>
  );
}

export default SearchResults;

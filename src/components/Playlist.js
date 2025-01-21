import React from "react";
import Track from "./Track";

function Playlist({ playlistName, onNameChange, playlistTracks, onRemove, onSave }) {
  const handleNameChange = (event) => {
    onNameChange(event.target.value);
  };

  return (
    <div className="Playlist">
      <input
        type="text"
        value={playlistName}
        onChange={handleNameChange}
        placeholder="Enter playlist name"
      />
      {/* Map through playlist tracks */}
      {playlistTracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onRemove={onRemove}
          isRemoval={true} // Ensures we display the "Remove" button
        />
      ))}
      {/* Button to save the playlist */}
      <button onClick={onSave}>Save to Spotify</button>
    </div>
  );
}

export default Playlist;

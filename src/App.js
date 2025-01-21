import React, { useState } from "react";
import "./App.css";
import Spotify from "./components/Spotify"; // Import Spotify module
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  Spotify.getAccessToken(); // Ensure access token is fetched

  // Search Spotify and update searchResults
  const searchSpotify = (term) => {
    Spotify.search(term).then((results) => {
      setSearchResults(results);
    });
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const addTrack = (track) => {
    if (!playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );
  };

  const savePlaylist = async () => {
    const trackUris = playlistTracks.map((track) => track.uri);

    if (!playlistName || trackUris.length === 0) {
      console.log("Cannot save an empty playlist!");
      return;
    }

    try {
      // Fetch user ID and save the playlist
      const userId = await Spotify.getUserId();
      console.log("User ID fetched successfully:", userId);

      const playlistId = await Spotify.createPlaylist(userId, playlistName, trackUris);
      console.log(`Playlist "${playlistName}" created with ID: ${playlistId}`);

      // Reset playlist state after saving
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jammming App</h1>
      </header>
      <div className="App-content">
        <SearchBar onSearch={searchSpotify} />
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
        <Playlist
          playlistName={playlistName}
          onNameChange={updatePlaylistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;

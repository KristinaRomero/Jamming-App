import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Spotify from "./components/Spotify"; // Import Spotify module
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

function CallbackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the callback from Spotify
    Spotify.getAccessToken();
    navigate("/"); // Redirect to the home page
  }, [navigate]);

  return <div>Loading...</div>; // Optional: Show a loading message while processing the token
}

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

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
      const userId = await Spotify.getUserId();
      const playlistId = await Spotify.createPlaylist(userId, playlistName, trackUris);

      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
  };

  return (
    <Router basename="/Jamming-App">
      <div className="App">
        <header className="App-header">
          <h1>Jammming App</h1>
        </header>
        <Routes>
          <Route
            path="/"
            element={
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
            }
          />
          <Route path="/callback" element={<CallbackHandler />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

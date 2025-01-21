const clientId = "edd375f180f04080aac77d279a03169a"; // Replace with your actual Client ID
const redirectUri = "https://KristinaRomero.github.io/Jamming-App/callback"; // Update to GitHub Pages URL
let accessToken;


const Spotify = {
    getAccessToken() {
      if (accessToken) {
        return accessToken;
      }
  
      // Check for access token and expiration in the URL
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  
      if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
  
        // Clear the access token after it expires
        window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
        window.history.pushState("Access Token", null, "/Jamming-App/"); // Ensure we redirect back to the app's root
  
        return accessToken;
      } else {
        // Redirect to Spotify authorization
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = authUrl;
      }
    },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Search request failed.");
        }
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  // Fetch the user's Spotify ID
  async getUserId() {
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      const response = await fetch("https://api.spotify.com/v1/me", { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch user ID.");
      }
      const jsonResponse = await response.json();
      return jsonResponse.id; // Return the user's Spotify ID
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    // Use the getUserId function here to fetch the user ID
    return Spotify.getUserId()
      .then((userId) => {
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers,
          method: "POST",
          body: JSON.stringify({ name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
              {
                headers,
                method: "POST",
                body: JSON.stringify({ uris: trackUris }),
              }
            );
          });
      })
      .catch((error) => {
        console.error("Error saving playlist:", error);
      });
  },
};

export default Spotify;

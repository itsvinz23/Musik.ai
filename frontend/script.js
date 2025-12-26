document.getElementById('recognizeBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('audioUpload');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please upload an audio file first!');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Audio = reader.result.split(',')[1];

    try {
      const response = await fetch('http://localhost:5000/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: base64Audio })
      });

      const data = await response.json();
      console.log(data);

      // Basic info
      document.getElementById('songTitle').textContent =
        "Title: " + (data.result?.title || "Unknown");
      document.getElementById('songArtist').textContent =
        "Artist: " + (data.result?.artist || "Unknown");

      // Album art (Spotify or Apple Music)
      const albumArtUrl =
        data.result?.spotify?.album?.images?.[0]?.url ||
        data.result?.apple_music?.artwork?.url;

      let albumArtHtml = "";
      if (albumArtUrl) {
        albumArtHtml += `<img src="${albumArtUrl}" alt="Album Art" style="max-width:200px;border-radius:8px;">`;
      }

      // Spotify link
      const spotifyUrl = data.result?.spotify?.external_urls?.spotify;
      if (spotifyUrl) {
        albumArtHtml += `<p><a href="${spotifyUrl}" target="_blank">🎧 Listen on Spotify</a></p>`;
      }

      document.getElementById('albumArt').innerHTML = albumArtHtml;

    } catch (err) {
      console.error(err);
      alert('Recognition failed. Check backend logs.');
    }
  };

  reader.readAsDataURL(file);
});

document.getElementById('recognizeBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('audioUpload');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please upload an audio file first!');
    return;
  }

  // Convert file to base64
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

      document.getElementById('songTitle').textContent =
        "Title: " + (data.result?.title || "Unknown");
      document.getElementById('songArtist').textContent =
        "Artist: " + (data.result?.artist || "Unknown");
    } catch (err) {
      console.error(err);
      alert('Recognition failed. Check backend logs.');
    }
  };

  reader.readAsDataURL(file);
});

const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const lyrics = document.getElementById('lyrics');
const singleResult = document.getElementById('single-result');
const noLyrics = document.getElementById('no-lyrics');

const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  for (let i = 0; i < 10; i++) {
    const element = data.data[i];
    let songName = element.title;
    let artistName = element.artist.name;
    let info = document.createElement('div');
    info.innerHTML = `
            <span class="span"><strong>${songName}</strong> Album By ${artistName}</span>
            <button class="btn btn-success lyrics-button text-md-right" data-artist="${artistName}" data-songtitle="${songName}">Get Lyrics</button>
            `;
    result.appendChild(info);
  }
  singleResult.style.display = "block";
}

// Get lyrics for song
async function getLyrics(artistName, songName) {
  const res = await fetch(`${apiURL}/v1/${artistName}/${songName}`);
  const data = await res.json();
  console.log(data)

  if (data.error) {
    result.innerHTML = data.error;
    
  } else {
    const lyric = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    lyrics.innerHTML = `
            <h2><strong>${songName}</strong> - ${artistName}</h2>
            <pre class="container"><span>${lyric}</span></pre>
        `;
    
  }
}

// Event listeners
form.addEventListener('submit', e => {

  //singleResult.style.display = "block";

  e.preventDefault();

  const searchTerm = search.value.trim();


  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});
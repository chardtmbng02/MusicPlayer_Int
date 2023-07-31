const progress = document.querySelector("#progress");
const song = document.querySelector("#song");
const playIcon = document.querySelector("#play-icon");
const play = document.querySelector(".play");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const lyricsContainer = document.querySelector(".lyrics-details");

const songs = [
  {
    title: "Babalik Sa'Yo",
    artist: "Moira Dela Torre",
    url: "./songs/moira_dela_torre_babalik_sayo.mp3"
  }
];

let animationFrameId; // Variable to hold the requestAnimationFrame ID

// Function to format time in minutes and seconds
function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Update the timer display with current time and duration
function updateTimerDisplay() {
  const currentTime = formatTime(song.currentTime);
  const duration = formatTime(song.duration);
  currentTimeDisplay.textContent = currentTime;
  durationDisplay.textContent = duration;
}

play.addEventListener("click", function () {
  if (song.paused) {
    playSong();
    
  } else {
    pauseSong();
  }
});

// Function to start playing the song and updating the UI
function playSong() {
  song.play();
  playIcon.classList.remove("fa-play");
  playIcon.classList.add("fa-pause");
  updateUI();
}

// Function to pause the song and stop updating the UI
function pauseSong() {
  song.pause();
  playIcon.classList.remove("fa-pause");
  playIcon.classList.add("fa-play");
  cancelAnimationFrame(animationFrameId);
}

// function that responsible for continuously updating the user interface while the song is playing
function updateUI() {
  if (!song.paused && song.currentTime < song.duration) {
    updateTimerDisplay();
    const progressPercentage = (song.currentTime / song.duration) * 100;
    progress.value = progressPercentage;

    animationFrameId = requestAnimationFrame(updateUI);
  } else {
    pauseSong();
  }
}

// Function to update the song's progress based on the progress bar value
function updateSongProgress() {
  const progressPercentage = progress.value;
  const newTime = (progressPercentage / 100) * song.duration;
  song.currentTime = newTime;
  playSong();
}
// Update the UI when the progress bar is dragged
progress.addEventListener("input", updateSongProgress);

// Function to load and play the next song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length; // Move to the next song in the 'songs' array
  song.src = songs[currentSongIndex].url; // Set the 'src' attribute of the <audio> element to the new song URL
  updateTitleAndArtist();
  playSong(); 
  updateUI();
  progress.value = 0;
}

// Function to load and play the previous song
function playPreviousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; // Move to the previous song in the 'songs' array
  song.src = songs[currentSongIndex].url; // Set the 'src' attribute of the <audio> element to the new song URL
  updateTitleAndArtist();
  song.play();
  progress.value = 0;
}
// Function to update the title and artist
function updateTitleAndArtist() {
  const title = songs[currentSongIndex].title;
  const artist = songs[currentSongIndex].artist;
  document.querySelector(".lyrics-title h2").textContent = title;
  document.querySelector(".lyrics-title p").textContent = artist;
}

// Add click event listeners to the next and back buttons
const nextButton = document.querySelector(".forward");
const backButton = document.querySelector(".backward");

nextButton.addEventListener("click", playNextSong);
backButton.addEventListener("click", playPreviousSong);

// Load and play the first song
let currentSongIndex = 0;
song.src = songs[currentSongIndex].url;

// indicates the tab with the active class
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-pane');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    tabs.forEach(tabItem => {
      if (tabItem === tab) {
        tabItem.classList.add('active');
      } else {
        tabItem.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.dataset.tab === targetTab) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  });
});

// Function to fetch and display the lyrics
async function fetchData() {
  const url =
    "https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=8222317";
    
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c9759fb298msh0218807d2fa5c83p1837afjsnc34c07284661",
      "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const lyrics = stripHtmlTags(data.lyrics.lyrics.body.html);
    displayLyrics(lyrics);
  } catch (error) {
    console.error(error);
  }
}

// Function to strip HTML tags from the lyrics
function stripHtmlTags(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent;
}

// Function to display the lyrics in the lyrics-details container
function displayLyrics(lyrics) {
  const lyricsDetails = document.querySelector(".lyrics-details");
  lyricsDetails.innerHTML = `<pre>${lyrics}</pre>`;
}

 // Function to fetch data from the Spotify API and display albums
 async function fetchSpotifyData() {
    const url =
      'https://spotify23.p.rapidapi.com/search/?q=taylor%20swift&type=multi&offset=0&limit=10&numberOfTopResults=5';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'c9759fb298msh0218807d2fa5c83p1837afjsnc34c07284661',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const albums = data.albums.items.slice(0, 9); 
      displayAlbums(albums);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to display albums
  function displayAlbums(albums) {
    const albumsDetails = document.querySelector(".albums-details[data-tab='albums']");
    albumsDetails.innerHTML = albums.map(album => {
      const albumName = album.data.name;
      const releaseYear = album.data.date.year;
      const imageUrl = album.data.coverArt.sources[0].url;
      const spotifyUrl = `https://open.spotify.com/album/${album.data.uri.split(':')[2]}`; // we use split to get the id of the album


      return `<div class="album-item">
                <a href="${spotifyUrl}" target="_blank"> 
                  <img src="${imageUrl}" alt="${albumName}" style="width: 200px; height: 200px;">
                  <p class="album-name">${albumName}</p>
                  <p class="album-year">${releaseYear}</p>
                </a>
              </div>`;
    }).join("");
  }
  
  
  const url = 'https://spotify23.p.rapidapi.com/artist_related/?id=06HL4z0CvFAxyc27GXpf02';
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': 'c9759fb298msh0218807d2fa5c83p1837afjsnc34c07284661',
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
  };

  // Function to fetch data from the Spotify API and display related artists
  async function fetchRelatedArtists(url, options) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        
        const relatedArtists = data.artists.map(artist => {
            const spotifyUrl = `https://open.spotify.com/artist/${artist.uri.split(':')[2]}`;
            return {
                name: artist.name,
                image: artist.images.length > 0 ? artist.images[0].url : "",
                spotifyUrl: spotifyUrl
            };
        });

        // Update the HTML to display the related artists' information
        const relatedArtistsContainer = document.querySelector('.artists-details[data-tab="artists"]');
        relatedArtistsContainer.innerHTML = ''; // Clear existing content (if any)

        relatedArtists.forEach(artist => {
            const artistElement = document.createElement('div');
            artistElement.innerHTML = `
                <a href="${artist.spotifyUrl}" target="_blank">
                    <img src="${artist.image}" alt="${artist.name}" width="200" height="200">
                    <p class="artist-name">${artist.name}</p>
                </a>
            `;
            relatedArtistsContainer.appendChild(artistElement);
        });
    } catch (error) {
        console.error(error);
    }
}



// invoke all the functon here
fetchData();
fetchSpotifyData();
fetchRelatedArtists(url, options);

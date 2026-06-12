import { state } from './main.js';
import { renderMainContent } from './render.js';
import { filterTracksBySearch } from './api.js';

let currentAudio = null;
let isSeeking = false;

export function initPlayer() {
  const mainPlayBtn = document.getElementById('main-play-btn');
  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', () => {
      if (!state.playingTrack) return;
      
      if (state.isPlaying) {
        if (currentAudio) currentAudio.pause();
        state.isPlaying = false;
      } else {
        if (currentAudio) currentAudio.play().catch(e => console.error("Play error:", e));
        state.isPlaying = true;
      }
      updatePlayerUI();
      renderMainContent();
    });
  }

  const progressBar = document.querySelector('footer input[type="range"]');
  if (progressBar) {
    progressBar.addEventListener('mousedown', () => { isSeeking = true; });
    progressBar.addEventListener('touchstart', () => { isSeeking = true; }, { passive: true });
    
    progressBar.addEventListener('mouseup', (e) => { 
      isSeeking = false; 
      if (currentAudio && currentAudio.duration) {
        currentAudio.currentTime = (e.target.value / 100) * currentAudio.duration;
      }
    });
    progressBar.addEventListener('touchend', (e) => { 
      isSeeking = false; 
      if (currentAudio && currentAudio.duration) {
        currentAudio.currentTime = (e.target.value / 100) * currentAudio.duration;
      }
    });
    
    progressBar.addEventListener('input', (e) => {
      if (currentAudio && currentAudio.duration) {
        const seekTime = (e.target.value / 100) * currentAudio.duration;
        const m = Math.floor(seekTime / 60);
        const s = Math.floor(seekTime % 60).toString().padStart(2, '0');
        const timeCurrentEl = document.getElementById('player-time-current');
        if (timeCurrentEl) timeCurrentEl.textContent = `${m}:${s}`;
      }
    });
  }

  const footerDlBtn = document.getElementById('footer-dl-btn');
  if (footerDlBtn) {
    footerDlBtn.addEventListener('click', () => {
      if (!state.playingTrack || !state.data || !state.data.themes) return;
      
      let track = null;
      for (const theme of state.data.themes) {
        track = theme.tracks?.find(t => t.id === state.playingTrack);
        if (track) break;
      }
      
      if (track && track.full_url) {
        window.downloadTrack(track.full_url, track.title);
      }
    });
  }

  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      playNextTrack();
    });
  }

  const btnPrev = document.getElementById('btn-prev');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      playPrevTrack();
    });
  }
}

export function playTrack(trackId, title, type, duration, artUrl) {
  let fullUrl = '';
  if (state.data && state.data.themes) {
    for (const theme of state.data.themes) {
      const track = theme.tracks?.find(t => t.id === trackId);
      if (track && track.full_url) {
        fullUrl = track.full_url;
        break;
      }
    }
  }

  if (state.playingTrack === trackId && state.isPlaying) {
    state.isPlaying = false;
    if (currentAudio) currentAudio.pause();
  } else {
    if (state.playingTrack !== trackId) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      if (fullUrl) {
        currentAudio = new Audio(fullUrl);
        
        currentAudio.addEventListener('ended', () => {
          playNextTrack();
        });
        
        currentAudio.addEventListener('timeupdate', () => {
          const currentTime = currentAudio.currentTime;
          const m = Math.floor(currentTime / 60);
          const s = Math.floor(currentTime % 60).toString().padStart(2, '0');
          const timeCurrentEl = document.getElementById('player-time-current');
          if (timeCurrentEl && !isSeeking) {
            timeCurrentEl.textContent = `${m}:${s}`;
          }
          
          const progressBar = document.querySelector('footer input[type="range"]');
          if (progressBar && currentAudio.duration && !isSeeking) {
            progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
          }
        });
      } else {
        currentAudio = null;
        const progressBar = document.querySelector('footer input[type="range"]');
        if (progressBar) progressBar.value = 0;
        const timeCurrentEl = document.getElementById('player-time-current');
        if (timeCurrentEl) timeCurrentEl.textContent = "0:00";

        const footerDlBtn = document.getElementById('footer-dl-btn');
        if (footerDlBtn) {
          footerDlBtn.disabled = true;
          footerDlBtn.className = "flex items-center space-x-1 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 cursor-not-allowed px-3 py-1.5 rounded transition";
        }
      }
    }
    
    state.playingTrack = trackId;
    state.isPlaying = true;
    if (currentAudio) {
      currentAudio.play().catch(e => console.error("Play error:", e));
    }
    
    document.getElementById('player-track-name').textContent = title;

    const footerDlBtn = document.getElementById('footer-dl-btn');
    if (footerDlBtn) {
      footerDlBtn.disabled = false;
      footerDlBtn.className = "flex items-center space-x-1 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded transition cursor-pointer";
    }

    if (duration) {
      const m = Math.floor(duration / 60);
      const s = Math.floor(duration % 60).toString().padStart(2, '0');
      document.getElementById('player-time-total').textContent = `${m}:${s}`;
    } else {
      document.getElementById('player-time-total').textContent = type === 'loop' ? '1:05' : '0:30';
    }

    if (artUrl) {
      const artImg = document.getElementById('player-album-art');
      const placeholder = document.getElementById('player-album-placeholder');
      if (artImg && placeholder) {
        artImg.src = artUrl;
        artImg.classList.remove('hidden');
        placeholder.classList.add('hidden');
      }
    }
  }
  updatePlayerUI();
  renderMainContent();
}

function updatePlayerUI() {
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  
  if (state.isPlaying) {
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
  } else {
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
  }
}

export function playNextTrack() {
  if (!state.data || !state.data.themes) {
    state.isPlaying = false;
    updatePlayerUI();
    renderMainContent();
    return;
  }

  if (state.searchQuery) {
    const results = filterTracksBySearch(state.data.themes, state.searchQuery);
    if (results.length > 0) {
      const currentIndex = results.findIndex(r => r.track.id === state.playingTrack);
      if (currentIndex >= 0) {
        for (let i = 1; i <= results.length; i++) {
          const nextIndex = (currentIndex + i) % results.length;
          const nextResult = results[nextIndex];
          if (nextResult.track.full_url) {
            playTrack(nextResult.track.id, nextResult.track.title, nextResult.track.type, nextResult.track.duration, nextResult.album.art);
            return;
          }
        }
      }
    }
  }

  let currentTheme = state.data.themes.find(t => t.tracks && t.tracks.some(track => track.id === state.playingTrack));
  if (!currentTheme) currentTheme = state.data.themes.find(t => t.id === state.currentThemeId);
  if (!currentTheme || !currentTheme.albums) {
    state.isPlaying = false;
    updatePlayerUI();
    renderMainContent();
    return;
  }

  let currentAlbumIndex = currentTheme.albums.findIndex(a => a.tracks && a.tracks.includes(state.playingTrack));
  if (currentAlbumIndex === -1) currentAlbumIndex = 0;
  
  const currentAlbum = currentTheme.albums[currentAlbumIndex];
  const trackIndex = currentAlbum.tracks.indexOf(state.playingTrack);

  let nextTrackId = null;
  let nextAlbum = currentAlbum;

  for (let i = trackIndex + 1; i < currentAlbum.tracks.length; i++) {
    const t = currentTheme.tracks.find(track => track.id === currentAlbum.tracks[i]);
    if (t && t.full_url) {
      nextTrackId = t.id;
      break;
    }
  }

  if (!nextTrackId) {
    for (let i = 1; i <= currentTheme.albums.length; i++) {
      const nextAlbumIdx = (currentAlbumIndex + i) % currentTheme.albums.length;
      const album = currentTheme.albums[nextAlbumIdx];
      
      if (!album.tracks) continue;
      
      const playableTrackId = album.tracks.find(tid => {
        const t = currentTheme.tracks.find(track => track.id === tid);
        return t && t.full_url;
      });

      if (playableTrackId) {
        nextTrackId = playableTrackId;
        nextAlbum = album;
        break;
      }
    }
  }

  if (nextTrackId) {
    const nextTrack = currentTheme.tracks.find(t => t.id === nextTrackId);
    playTrack(nextTrack.id, nextTrack.title, nextTrack.type, nextTrack.duration, nextAlbum.art);
  } else {
    state.isPlaying = false;
    updatePlayerUI();
    renderMainContent();

    const footerDlBtn = document.getElementById('footer-dl-btn');
    if (footerDlBtn) {
      footerDlBtn.disabled = true;
      footerDlBtn.className = "flex items-center space-x-1 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 cursor-not-allowed px-3 py-1.5 rounded transition";
    }
  }
}

export function playPrevTrack() {
  if (!state.data || !state.data.themes || !state.playingTrack) return;

  if (state.searchQuery) {
    const results = filterTracksBySearch(state.data.themes, state.searchQuery);
    if (results.length > 0) {
      const currentIndex = results.findIndex(r => r.track.id === state.playingTrack);
      if (currentIndex >= 0) {
        for (let i = 1; i <= results.length; i++) {
          const prevIndex = (currentIndex - i + results.length) % results.length;
          const prevResult = results[prevIndex];
          if (prevResult.track.full_url) {
            playTrack(prevResult.track.id, prevResult.track.title, prevResult.track.type, prevResult.track.duration, prevResult.album.art);
            return;
          }
        }
      }
    }
  }

  let currentTheme = state.data.themes.find(t => t.tracks && t.tracks.some(track => track.id === state.playingTrack));
  if (!currentTheme) currentTheme = state.data.themes.find(t => t.id === state.currentThemeId);
  if (!currentTheme || !currentTheme.albums) return;

  let currentAlbumIndex = currentTheme.albums.findIndex(a => a.tracks && a.tracks.includes(state.playingTrack));
  if (currentAlbumIndex === -1) currentAlbumIndex = 0;
  
  const currentAlbum = currentTheme.albums[currentAlbumIndex];
  const trackIndex = currentAlbum.tracks.indexOf(state.playingTrack);

  let prevTrackId = null;
  let prevAlbum = currentAlbum;

  for (let i = trackIndex - 1; i >= 0; i--) {
    const t = currentTheme.tracks.find(track => track.id === currentAlbum.tracks[i]);
    if (t && t.full_url) {
      prevTrackId = t.id;
      break;
    }
  }

  if (!prevTrackId) {
    for (let i = 1; i <= currentTheme.albums.length; i++) {
      const prevAlbumIdx = (currentAlbumIndex - i + currentTheme.albums.length) % currentTheme.albums.length;
      const album = currentTheme.albums[prevAlbumIdx];
      
      if (!album.tracks) continue;
      
      for (let j = album.tracks.length - 1; j >= 0; j--) {
        const tid = album.tracks[j];
        const t = currentTheme.tracks.find(track => track.id === tid);
        if (t && t.full_url) {
          prevTrackId = t.id;
          prevAlbum = album;
          break;
        }
      }
      if (prevTrackId) break;
    }
  }

  if (prevTrackId) {
    const prevTrack = currentTheme.tracks.find(t => t.id === prevTrackId);
    playTrack(prevTrack.id, prevTrack.title, prevTrack.type, prevTrack.duration, prevAlbum.art);
  }
}
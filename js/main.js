import { fetchSiteData } from './api.js';
import { renderThemes, renderMainContent, renderInfoArea } from './render.js';
import { initPlayer, playTrack } from './player.js';

export const state = {
  data: null,
  currentThemeId: 'ambient',
  currentAlbum: null,
  playingTrack: null,
  isPlaying: false,
  searchQuery: ''
};

window.state = state;

async function init() {
  const data = await fetchSiteData();
  state.data = data;
  
  initPlayer();
  renderInfoArea(); // 追加
  renderThemes();
  renderMainContent();
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      state.currentAlbum = null;
      renderThemes();
      renderMainContent();
    });
  }

  // Handle local overrides from Tauri app (Live Preview)
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'LOCAL_OVERRIDES') {
      const { albums, tracks } = event.data;
      let updated = false;
      
      if (state.data && state.data.themes) {
        state.data.themes.forEach(theme => {
          if (theme.albums) {
            theme.albums.forEach(album => {
              if (albums[album.id]) {
                album.art = albums[album.id];
                updated = true;
              }
            });
          }
          if (theme.tracks) {
            theme.tracks.forEach(track => {
              if (tracks[track.id]) {
                track.full_url = tracks[track.id];
                updated = true;
              }
            });
          }
        });
      }
      
      if (updated) {
        renderThemes();
        renderMainContent();
      }
    }
  });
}

window.selectTheme = (themeId) => {
  state.currentThemeId = themeId;
  state.currentAlbum = null;
  state.searchQuery = '';
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  
  renderThemes();
  renderMainContent();
  document.getElementById('scroll-area').scrollTo(0, 0);
};

window.selectAlbum = (themeId, albumId) => {
  const theme = state.data.themes.find(t => t.id === themeId);
  if (!theme) return;
  const album = theme.albums.find(a => a.id === albumId);
  state.currentAlbum = album;
  renderMainContent();
  document.getElementById('scroll-area').scrollTo(0, 0);
};

window.backToAlbums = () => {
  state.currentAlbum = null;
  renderMainContent();
};

window.playTrack = playTrack;

// 歌詞表示用モーダル
window.showLyrics = (title, lyrics) => {
  document.getElementById('modal-title').textContent = `${title} - Lyrics`;
  // 改行を維持するために white-space: pre-wrap を適用した div で囲む
  document.getElementById('modal-body').innerHTML = `
    <div class="whitespace-pre-wrap text-center font-medium leading-relaxed text-gray-800">
      ${lyrics}
    </div>
  `;
  
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

// モーダル制御
window.openModal = (pageKey) => {
  const pageData = state.data.pagesData?.pages?.[pageKey];
  if (!pageData) return;

  document.getElementById('modal-title').textContent = pageData.title;
  document.getElementById('modal-body').innerHTML = pageData.content;
  
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden'; // 背後のスクロール防止
};

window.closeModal = () => {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  document.body.style.overflow = '';
};

window.searchByTag = (tag) => {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = tag;
  }
  state.searchQuery = tag;
  state.currentAlbum = null;
  
  renderThemes();
  renderMainContent();
  document.getElementById('scroll-area').scrollTo(0, 0);
};

init();
import { fetchSiteData } from './api.js';
import { renderThemes, renderMainContent, renderInfoArea } from './render.js';
import { initPlayer, playTrack } from './player.js';

export const state = {
  data: null,
  currentThemeId: 'ambient',
  currentAlbum: null,
  playingTrack: null,
  isPlaying: false,
  searchQuery: '',
  currentMode: 'theme',
  currentContentId: null,
  isSelectMode: false,
  selectedTracks: new Set()
};

window.state = state;

function updateMetaTags(url) {
  let title = "Neura Music Archive - AI BGM Portal & Creator Tools";
  let description = "AIが生成した商用利用可能・クレジット表記不要の高品質なBGMを無料ダウンロードできる「Neura Music Archive」。動画や配信用BGMに加え、OBS等で使える便利なHTML時計などクリエイター向けツールも公開中。";

  if (state.currentAlbum) {
    title = `${state.currentAlbum.title} - Neura Music Archive`;
    if (state.currentAlbum.caption) {
      description = state.currentAlbum.caption.replace(/<[^>]*>?/gm, '');
    }
  }

  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = description;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url.toString();
}

function updateURL() {
  const url = new URL(window.location.href);
  url.searchParams.delete('theme');
  url.searchParams.delete('album');
  url.searchParams.delete('tool');
  url.searchParams.delete('article');
  url.searchParams.delete('search');

  let newPath = '/';
  if (state.searchQuery) {
    newPath = '/search/' + encodeURIComponent(state.searchQuery);
  } else if (state.currentMode === 'theme') {
    if (state.currentThemeId && state.currentAlbum) {
      newPath = '/theme/' + state.currentThemeId + '/album/' + state.currentAlbum.id;
    } else if (state.currentThemeId) {
      newPath = '/theme/' + state.currentThemeId;
    }
  } else if (state.currentMode === 'tool') {
    if (state.currentContentId) newPath = '/tool/' + state.currentContentId;
  } else if (state.currentMode === 'article') {
    if (state.currentContentId) newPath = '/article/' + state.currentContentId;
  }

  url.pathname = newPath;

  if (url.toString() !== window.location.href) {
    window.history.pushState(null, '', url);
  }
  
  updateMetaTags(url);
}

function syncStateFromURL() {
  const pathParts = window.location.pathname.split('/').filter(p => p);
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search') || (pathParts[0] === 'search' ? decodeURIComponent(pathParts[1]) : null);
  const theme = params.get('theme') || (pathParts[0] === 'theme' ? pathParts[1] : null);
  const albumId = params.get('album') || (pathParts[2] === 'album' ? pathParts[3] : null);
  const tool = params.get('tool') || (pathParts[0] === 'tool' ? pathParts[1] : null);
  const article = params.get('article') || (pathParts[0] === 'article' ? pathParts[1] : null);

  state.searchQuery = '';
  state.currentAlbum = null;
  state.isSelectMode = false;
  state.selectedTracks.clear();

  if (search) {
    state.searchQuery = search;
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = search;
  } else if (tool) {
    state.currentMode = 'tool';
    state.currentContentId = tool;
  } else if (article) {
    state.currentMode = 'article';
    state.currentContentId = article;
  } else {
    state.currentMode = 'theme';
    if (theme) {
      state.currentThemeId = theme;
    }
    if (albumId && state.data && state.data.themes) {
      const themeData = state.data.themes.find(t => t.id === state.currentThemeId);
      if (themeData && themeData.albums) {
        state.currentAlbum = themeData.albums.find(a => a.id === albumId) || null;
      }
    }
  }
}

async function init() {
  const data = await fetchSiteData(() => {
    if (state.currentMode === 'theme' && state.currentThemeId && !state.currentAlbum) {
      const pathParts = window.location.pathname.split('/').filter(p => p);
      const albumId = new URLSearchParams(window.location.search).get('album') || (pathParts[2] === 'album' ? pathParts[3] : null);
      if (albumId && state.data && state.data.themes) {
        const themeData = state.data.themes.find(t => t.id === state.currentThemeId);
        if (themeData && themeData.albums) {
          state.currentAlbum = themeData.albums.find(a => a.id === albumId) || null;
        }
      }
    }

    renderThemes();
    if (state.searchQuery || state.currentMode === 'theme') {
      renderMainContent();
    }
  });
  state.data = data;

  syncStateFromURL();
  window.history.replaceState(null, '', window.location.href);
  updateMetaTags(new URL(window.location.href));
  
  initPlayer();
  renderInfoArea(); // 追加
  renderThemes();
  renderMainContent();
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value.trim();
        state.currentAlbum = null;
        updateURL();
        renderThemes();
        renderMainContent();
      }, 300);
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

  window.addEventListener('popstate', () => {
    syncStateFromURL();
    updateMetaTags(new URL(window.location.href));
    renderThemes();
    renderMainContent();
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) scrollArea.scrollTo(0, 0);
  });
}

window.selectTheme = (themeId) => {
  state.currentMode = 'theme';
  state.currentThemeId = themeId;
  state.currentAlbum = null;
  state.searchQuery = '';
  state.isSelectMode = false;
  state.selectedTracks.clear();
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  
  updateURL();
  renderThemes();
  renderMainContent();
  document.getElementById('scroll-area').scrollTo(0, 0);
};

window.selectTool = (toolId) => {
  state.currentMode = 'tool';
  state.currentContentId = toolId;
  state.currentAlbum = null;
  state.searchQuery = '';
  state.isSelectMode = false;
  state.selectedTracks.clear();
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  updateURL();
  renderThemes();
  renderMainContent();
  document.getElementById('scroll-area').scrollTo(0, 0);
};

window.selectArticle = (articleId) => {
  state.currentMode = 'article';
  state.currentContentId = articleId;
  state.currentAlbum = null;
  state.searchQuery = '';
  state.isSelectMode = false;
  state.selectedTracks.clear();
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  updateURL();
  renderThemes();
  renderMainContent();
  document.getElementById('scroll-area').scrollTo(0, 0);
};

window.selectAlbum = (themeId, albumId) => {
  const theme = state.data.themes.find(t => t.id === themeId);
  if (!theme) return;
  const album = theme.albums.find(a => a.id === albumId);
  state.currentAlbum = album;
  state.isSelectMode = false;
  state.selectedTracks.clear();
  updateURL();
  renderMainContent();
  document.getElementById('scroll-area').scrollTo(0, 0);
};

window.backToAlbums = () => {
  state.currentAlbum = null;
  state.isSelectMode = false;
  state.selectedTracks.clear();
  updateURL();
  renderMainContent();
};

window.playTrack = playTrack;

// 歌詞表示用モーダル
window.showLyrics = (title, lyrics) => {
  document.getElementById('modal-title').textContent = `${title} - Lyrics`;
  document.getElementById('modal-body').innerHTML = `
    <div class="whitespace-pre-wrap text-center font-medium leading-relaxed text-gray-800 dark:text-gray-200">
      ${lyrics}
    </div>
  `;
  
  // 歌詞用にサイズと余白を「中くらい」に設定
  const modalContainer = document.querySelector('#modal-overlay > div');
  modalContainer.className = "bg-white dark:bg-[#1c1c1c] w-full max-w-lg max-h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-transparent dark:border-gray-800";
  document.getElementById('modal-body').className = "p-6 md:p-8 overflow-y-auto text-gray-700 dark:text-gray-300 leading-relaxed";

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

// モーダル制御
window.openModal = (pageKey) => {
  let modalTitle = "";
  let modalContent = "";

  if (pageKey === 'privacy') {
    modalTitle = "プライバシーポリシー";
    const privacySource = document.getElementById('raw-privacy-policy');
    modalContent = privacySource ? privacySource.innerHTML : "プライバシーポリシーの読み込みに失敗しました。";
  } else {
    const pages = state.data.pagesData?.pages;
    if (!pages) return;

    if (pageKey === 'about') {
      modalTitle = "このサイトについて";
      const keysToMerge = ['terms', 'contact', 'ads'];
      let mergedHtml = "";
      
      keysToMerge.forEach(key => {
        const page = pages[key];
        if (page) {
          mergedHtml += `
            <div class="mb-10 last:mb-0">
              <h4 class="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">
                ${page.title}
              </h4>
              <div class="space-y-4">
                ${page.content}
              </div>
            </div>
          `;
        }
      });

      modalContent = mergedHtml ? mergedHtml : "<p class='text-gray-500'>データの読み込みに失敗しました。ブラウザのキャッシュをクリアして再度お試しください。</p>";
    } else {
      const pageData = pages[pageKey];
      if (!pageData) return;
      modalTitle = pageData.title;
      modalContent = pageData.content;
    }
  }

  document.getElementById('modal-title').textContent = modalTitle;
  document.getElementById('modal-body').innerHTML = modalContent;
  
  // 文章用にサイズと余白を「広め」に設定
  const modalContainer = document.querySelector('#modal-overlay > div');
  modalContainer.className = "bg-white dark:bg-[#1c1c1c] w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-transparent dark:border-gray-800";
  document.getElementById('modal-body').className = "p-6 md:p-8 overflow-y-auto text-gray-700 dark:text-gray-300 leading-relaxed";

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
  state.isSelectMode = false;
  state.selectedTracks.clear();
  
  updateURL();
  renderThemes();
  renderMainContent();
  document.getElementById('scroll-area').scrollTo(0, 0);
};

window.downloadTrack = async (url, title) => {
  try {
    const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'cb=' + new Date().getTime();
    const response = await fetch(fetchUrl, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `${title}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Download error:', error);
    alert('ダウンロードに失敗しました。CORSエラーが発生している可能性があります。コンソールを確認してください。');
    window.open(url, '_blank');
  }
};

window.toggleSelectMode = () => {
  state.isSelectMode = !state.isSelectMode;
  state.selectedTracks.clear();
  renderMainContent();
};

window.toggleTrackSelection = (event, trackId) => {
  event.stopPropagation();
  if (state.selectedTracks.has(trackId)) {
    state.selectedTracks.delete(trackId);
  } else {
    state.selectedTracks.add(trackId);
  }
  renderMainContent();
};

window.executeZipDownload = async (trackIds, albumTitle, btnElement) => {
  if (trackIds.length === 0 || btnElement.disabled) return;
  btnElement.disabled = true;
  
  const progressBar = btnElement.querySelector('#zip-progress-bar');
  const progressText = btnElement.querySelector('#zip-progress-text');
  const originalText = progressText.textContent;
  
  try {
    const zip = new JSZip();
    let completed = 0;
    
    progressText.textContent = `0 / ${trackIds.length} 処理中...`;
    if (progressBar) progressBar.style.width = '0%';
    
    const tracksToDownload = [];
    for (const theme of state.data.themes) {
      if (theme.tracks) {
        for (const track of theme.tracks) {
          if (trackIds.includes(track.id) && track.full_url) {
            tracksToDownload.push(track);
          }
        }
      }
    }

    if (tracksToDownload.length === 0) {
      alert('ダウンロード可能な音源がありません。');
      throw new Error('No downloadable tracks');
    }

    for (const track of tracksToDownload) {
      const fetchUrl = track.full_url + (track.full_url.includes('?') ? '&' : '?') + 'cb=' + new Date().getTime();
      const response = await fetch(fetchUrl, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const blob = await response.blob();
      
      zip.file(`${track.title}.mp3`, blob);
      
      completed++;
      const percent = Math.floor((completed / tracksToDownload.length) * 100);
      
      if (progressBar) progressBar.style.width = `${percent}%`;
      progressText.textContent = `${completed} / ${tracksToDownload.length} 処理中...`;
    }
    
    progressText.textContent = `ZIP構築中...`;
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${albumTitle}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('ZIP Download error:', error);
    alert('ZIPの作成中にエラーが発生しました。');
  } finally {
    btnElement.disabled = false;
    if (progressBar) progressBar.style.width = '0%';
    progressText.textContent = originalText;
    
    if (state.isSelectMode) {
      window.toggleSelectMode();
    }
  }
};

window.downloadAlbumZip = (albumId, btnElement) => {
  const album = state.currentAlbum;
  if (!album || album.id !== albumId) return;
  window.executeZipDownload(album.tracks, album.title, btnElement);
};

window.downloadSelectedZip = (albumId, btnElement) => {
    const album = state.currentAlbum;
    if (!album || album.id !== albumId) return;
    const tracks = Array.from(state.selectedTracks);
    window.executeZipDownload(tracks, `${album.title}_selected`, btnElement);
  };
  
  init();
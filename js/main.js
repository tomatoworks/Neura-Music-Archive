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
  let title = "🎼 Neura Music Archive - AI BGM Portal & Creator Tools";
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
  const pageData = state.data.pagesData?.pages?.[pageKey];
  if (!pageData) return;

  document.getElementById('modal-title').textContent = pageData.title;
  document.getElementById('modal-body').innerHTML = pageData.content;
  
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

  window.shareAlbum = (albumTitle) => {
    const url = window.location.href;
    const text = `Neura Music Archiveで「${albumTitle}」を聴いています！\n`;

    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.share({
        title: albumTitle,
        text: text,
        url: url
      }).catch(console.error);
      return;
    }

    document.getElementById('modal-title').textContent = 'アルバムを共有';
    
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const xUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`;

    document.getElementById('modal-body').innerHTML = `
      <div class="flex flex-col gap-2">
        <a href="${xUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#262626] transition group border border-transparent dark:border-transparent dark:hover:border-gray-700">
          <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </div>
          <span class="font-bold text-[15px] text-gray-800 dark:text-gray-200">X (Twitter) で共有</span>
        </a>
        
        <a href="${lineUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#262626] transition group border border-transparent dark:border-transparent dark:hover:border-gray-700">
          <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-[#06C755] group-hover:text-white transition">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992zm-14.288 3.513h-2.923c-.352 0-.638-.285-.638-.638V8.309c0-.352.286-.638-.638-.638h2.923c.352 0 .638.286.638.638v4.87c0 .352-.286.638-.638.638zm4.722-3.593v2.955c0 .352-.286.638-.638.638h-2.922c-.352 0-.638-.285-.638-.638v-4.87c0-.352.286-.638.638-.638h2.922c.352 0 .638.286.638.638v.638c0 .352-.286.638-.638.638h-1.646v.718h1.646c.352 0 .638.286.638.638zm6.549 3.593h-1.275c-.352 0-.638-.285-.638-.638v-4.87c0-.352.286-.638.638-.638h1.275c.352 0 .638.286.638.638v4.87c0 .352-.286.638-.638.638zm-2.88-4.87v4.87c0 .352-.286.638-.638.638h-1.076c-.22 0-.417-.112-.533-.284l-2.072-3.078v2.724c0 .352-.286.638-.638.638h-1.275c-.352 0-.638-.285-.638-.638v-4.87c0-.352.286-.638.638-.638h1.076c.22 0 .417.112.533.284l2.072 3.078v-2.724c0-.352.286-.638.638-.638h1.275c.352 0 .638.286.638.638z"/></svg>
          </div>
          <span class="font-bold text-[15px] text-gray-800 dark:text-gray-200">LINE で送る</span>
        </a>

        <button onclick="copyToClipboard('${url}')" class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#262626] transition group border border-transparent dark:border-transparent dark:hover:border-gray-700 w-full text-left">
          <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </div>
          <span class="font-bold text-[15px] text-gray-800 dark:text-gray-200" id="copy-btn-text">リンクをコピー</span>
        </button>
      </div>
    `;
    
    // シェア用にサイズと余白を「コンパクト」に設定
    const modalContainer = document.querySelector('#modal-overlay > div');
    modalContainer.className = "bg-white dark:bg-[#1c1c1c] w-full max-w-sm max-h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-transparent dark:border-gray-800";
    document.getElementById('modal-body').className = "p-4 md:p-5 overflow-y-auto text-gray-700 dark:text-gray-300 leading-relaxed";

    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  window.copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      const btnText = document.getElementById('copy-btn-text');
      if (btnText) {
        const originalText = btnText.textContent;
        btnText.textContent = 'コピーしました！';
        setTimeout(() => {
          btnText.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  init();
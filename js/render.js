import { state } from './main.js';
import { filterTracksBySearch } from './api.js';

// スライダーのタイマーを保持する変数（再レンダリング時の重複防止）
let infoSliderInterval = null;

export function renderInfoArea() {
  const infoArea = document.getElementById('info-area');
  if (!infoArea) return;

  // 既存のタイマーがあればクリア
  if (infoSliderInterval) {
    clearInterval(infoSliderInterval);
    infoSliderInterval = null;
  }

  const infoData = state.data.pagesData?.info;
  let infoArray = [];

  // 配列形式でも単一オブジェクト形式でも対応できるように正規化
  if (Array.isArray(infoData)) {
    infoArray = infoData;
  } else if (infoData) {
    infoArray = [infoData];
  }

  // 空のデータ（DateとTextが両方空）を除外
  infoArray = infoArray.filter(item => item.date || item.text);

  // 表示する情報がない場合は非表示にして終了
  if (infoArray.length === 0) {
    infoArea.innerHTML = '';
    infoArea.classList.add('hidden');
    return;
  }
  
  infoArea.classList.remove('hidden');

  // 個別のInfoアイテムを生成する関数
  const createInfoItemHtml = (item) => `
    <div class="w-full flex-shrink-0 flex items-center justify-center relative">
      <div class="relative flex items-center max-w-xl">
        <div class="absolute right-full mr-3 flex items-center gap-2 w-max">
          <span class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider">NEWS</span>
          <span class="text-xs font-mono text-gray-500 dark:text-gray-400">${item.date || ''}</span>
        </div>
        <span class="text-sm text-gray-600 dark:text-gray-300 font-medium truncate">${item.text || ''}</span>
      </div>
    </div>
  `;

  // 無限ループ用に、最初の要素のクローンを最後に追加
  const sliderItems = [...infoArray];
  if (infoArray.length > 1) {
    sliderItems.push(infoArray[0]);
  }

  // スライド用のラッパーとトラックを出力（初期状態ではtransitionクラスを外しておく）
  infoArea.innerHTML = `
    <div class="w-full overflow-hidden flex items-center h-full">
      <div id="info-track" class="flex w-full" style="transform: translateX(0%);">
        ${sliderItems.map(createInfoItemHtml).join('')}
      </div>
    </div>
  `;

  // 複数ある場合のみ、10秒ごとにスライドさせるタイマーをセット
  if (infoArray.length > 1) {
    const track = document.getElementById('info-track');
    let currentIndex = 0;
    
    infoSliderInterval = setInterval(() => {
      currentIndex++;
      
      // アニメーションを有効にして左にスライド
      track.style.transition = 'transform 700ms ease-in-out';
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // クローン（一番最後の要素）に到達した場合
      if (currentIndex === infoArray.length) {
        // アニメーション完了後(700ms後)に、アニメーションを無効にして最初の位置へ瞬間移動させる
        setTimeout(() => {
          track.style.transition = 'none';
          currentIndex = 0;
          track.style.transform = `translateX(0%)`;
        }, 700);
      }
    }, 10000); // 10秒 (10000ミリ秒)
  }
}

export function renderThemes() {
  if (!state.data || !state.data.themes) return;
  
  const themeList = document.getElementById('theme-list');
  const themeListMobile = document.getElementById('theme-list-mobile');

  const createThemeHtml = (theme, isMobile) => {
    const isActive = state.currentMode === 'theme' && theme.id === state.currentThemeId && !state.searchQuery;
    const activeClass = isActive 
      ? (isMobile ? 'text-gray-900 dark:text-gray-100 font-bold border-b-2 border-gray-900 dark:border-gray-100 pb-1' : 'bg-gray-100 dark:bg-[#4a4a4a] text-gray-900 dark:text-gray-100 font-bold rounded-md')
      : (isMobile ? 'text-gray-500 dark:text-gray-400 pb-1' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#404040] hover:text-gray-900 dark:hover:text-gray-100 rounded-md');
    
    const trackCount = theme.tracks ? theme.tracks.length : 0;
    
    return isMobile
      ? `<button class="text-sm transition flex items-center gap-1.5 ${activeClass}" onclick="selectTheme('${theme.id}')">${theme.name} <span class="text-[10px] font-mono bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">${trackCount}</span></button>`
      : `<li><button class="w-full text-left px-3 py-2 text-sm transition flex justify-between items-center ${activeClass}" onclick="selectTheme('${theme.id}')"><span>${theme.name}</span> <span class="text-[10px] font-mono bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">${trackCount}</span></button></li>`;
  };

  const createItemHtml = (item, type, isMobile) => {
    if (item.is_visible === false) return '';
    const isActive = state.currentMode === type && state.currentContentId === item.id;
    const activeClass = isActive
      ? (isMobile ? 'text-gray-900 dark:text-gray-100 font-bold border-b-2 border-gray-900 dark:border-gray-100 pb-1' : 'bg-gray-100 dark:bg-[#4a4a4a] text-gray-900 dark:text-gray-100 font-bold rounded-md')
      : (isMobile ? 'text-gray-500 dark:text-gray-400 pb-1' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#404040] hover:text-gray-900 dark:hover:text-gray-100 rounded-md');
    const onClick = type === 'tool' ? `selectTool('${item.id}')` : `selectArticle('${item.id}')`;
    return isMobile
      ? `<button class="text-sm transition flex items-center gap-1.5 ${activeClass}" onclick="${onClick}">${item.title}</button>`
      : `<li><button class="w-full text-left px-3 py-2 text-sm transition flex justify-between items-center ${activeClass}" onclick="${onClick}"><span>${item.title}</span></button></li>`;
  };

  if (themeList) themeList.innerHTML = state.data.themes.map(t => createThemeHtml(t, false)).join('');
  
  let mobileHtml = state.data.themes.map(t => createThemeHtml(t, true)).join('');

  const toolList = document.getElementById('tool-list');
  const toolsHeading = document.getElementById('tools-heading');
  if (toolList && toolsHeading && state.data.tools && state.data.tools.length > 0) {
    toolsHeading.classList.remove('hidden');
    toolList.innerHTML = state.data.tools.map(t => createItemHtml(t, 'tool', false)).join('');
    mobileHtml += state.data.tools.map(t => createItemHtml(t, 'tool', true)).join('');
  }

  const articleList = document.getElementById('article-list');
  const articlesHeading = document.getElementById('articles-heading');
  if (articleList && articlesHeading && state.data.articles && state.data.articles.length > 0) {
    articlesHeading.classList.remove('hidden');
    articleList.innerHTML = state.data.articles.map(a => createItemHtml(a, 'article', false)).join('');
    mobileHtml += state.data.articles.map(a => createItemHtml(a, 'article', true)).join('');
  }

  if (themeListMobile) themeListMobile.innerHTML = mobileHtml;
}

export function renderMainContent() {
  if (!state.data) return;
  
  const mainContent = document.getElementById('main-content');
  
  // 他の画面に戻った際に、通常の余白を復元する処理
  mainContent.classList.remove('p-0', 'flex', 'flex-col');
  mainContent.classList.add('p-4', 'md:p-8');
  
  if (state.searchQuery) {
    const results = filterTracksBySearch(state.data.themes, state.searchQuery);
    renderSearchResults(results);
  } else if (state.currentMode === 'tool') {
    const tool = state.data.tools.find(t => t.id === state.currentContentId);
    if (tool) renderExternalContent(tool);
  } else if (state.currentMode === 'article') {
    const article = state.data.articles.find(a => a.id === state.currentContentId);
    if (article) renderExternalContent(article);
  } else if (state.currentAlbum) {
    renderAlbumDetail(state.currentAlbum);
  } else {
    const theme = state.data.themes.find(t => t.id === state.currentThemeId);
    if (theme) renderAlbumGrid(theme);
  }
}

function renderExternalContent(item) {
  const mainContent = document.getElementById('main-content');
  
  // 以前のiframe用の余白リセット（p-0）を解除し、通常の余白（p-4 md:p-8）に戻します
  mainContent.classList.remove('p-0', 'flex', 'flex-col');
  mainContent.classList.add('p-4', 'md:p-8');
  
  // 読み込み中のローディング表示
  mainContent.innerHTML = `
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full"></div>
    </div>
  `;
  
  // HTMLファイルをフェッチして流し込む
  fetch(item.content_url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      mainContent.innerHTML = html;
      
      // クローラー向けにページのタイトル（タブの名前）も動的に書き換えます
      if (item.title) {
        document.title = `${item.title} - Neura Music Archive`;
      }
    })
    .catch(error => {
      console.error('Failed to load article:', error);
      mainContent.innerHTML = `
        <div class="pt-4">
          <p class="text-red-500 text-base">記事の読み込みに失敗しました。</p>
        </div>
      `;
    });
}

function renderSearchResults(results) {
  const mainContent = document.getElementById('main-content');
  if (results.length === 0) {
    mainContent.innerHTML = `
      <div class="pt-4">
        <p class="text-gray-500 dark:text-gray-400 text-base">「${state.searchQuery}」に一致する結果が見つかりませんでした。</p>
      </div>
    `;
    return;
  }

  const tracksHtml = results.map(result => {
    const { themeId, album, track } = result;
    const isThisPlaying = state.playingTrack === track.id && state.isPlaying;
    const formatTime = (seconds) => {
      if (!seconds) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    const hasFull = !!track.full_url;

    const playBtnClass = hasFull 
      ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer" 
      : "bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed";
    const playBtnAction = hasFull 
      ? `onclick="playTrack('${track.id}', '${track.title.replace(/'/g, "\\'")}', '${track.type}', ${track.duration}, '${album.art}')"` 
      : `title="音源がありません" disabled`;

    const fullBtnClass = hasFull
      ? "text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition cursor-pointer"
      : "text-gray-200 dark:text-gray-700 cursor-not-allowed";
    const fullBtnAction = hasFull
      ? `onclick="downloadTrack('${track.full_url}', '${track.title.replace(/'/g, "\\'")}')"`
      : `title="フル音源がありません" disabled`;

    const tagsHtml = (track.tags && track.tags.length > 0)
      ? `<div class="flex flex-wrap gap-1 mt-1.5">
           ${track.tags.map(tag => `<button onclick="searchByTag('${tag}')" class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">#${tag}</button>`).join('')}
         </div>`
      : '';
      
    return `
    <div class="flex items-center gap-3 md:gap-4 p-3 md:p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626] transition group">
      
      <div class="relative cursor-pointer flex-shrink-0" onclick="selectAlbum('${themeId}', '${album.id}')" title="このアルバムを開く">
        <img src="${album.art}" class="w-12 h-12 md:w-14 md:h-14 object-cover rounded-md border border-gray-200 dark:border-gray-700" alt="Album Art" loading="lazy" decoding="async">
      </div>

      <button class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${playBtnClass}" ${playBtnAction}>
        ${isThisPlaying 
          ? `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
          : `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`
        }
      </button>

      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-[15px] md:text-base text-gray-900 dark:text-gray-100 truncate">${track.title}</h4>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 md:line-clamp-1">${track.caption || ''}</p>
        ${tagsHtml}
      </div>
      
      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="text-sm text-gray-400 dark:text-gray-500 font-mono hidden md:inline-block w-10 text-right">${formatTime(track.duration)}</span>
        <span class="text-xs font-mono text-gray-400 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded hidden md:inline-block">${track.type.toUpperCase()}</span>
        
        <button 
          class="flex flex-col items-center justify-center w-12 h-12 ${track.lyrics ? 'text-purple-500 hover:text-purple-700 dark:hover:text-purple-400 transition cursor-pointer' : 'text-gray-200 dark:text-gray-700 cursor-not-allowed'}" 
          ${track.lyrics ? `onclick="event.stopPropagation(); showLyrics('${track.title.replace(/'/g, "\\'")}', \`${track.lyrics.replace(/`/g, "\\`")}\`)"` : 'disabled'}
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-[10px] font-bold">LYRICS</span>
        </button>

        <button class="flex flex-col items-center justify-center w-12 h-12 ${fullBtnClass}" ${fullBtnAction}>
          <svg class="w-5 h-5 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          <span class="text-[10px] font-bold">DL</span>
        </button>
      </div>
    </div>
    `;
  }).join('');

  mainContent.innerHTML = `
    <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">「${state.searchQuery}」の検索結果 (${results.length}曲)</h2>
    <div class="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-[#242424]">
      ${tracksHtml}
    </div>
  `;
}

function createAlbumCardHtml(themeId, album) {
  const theme = state.data.themes.find(t => t.id === themeId);
  
  const firstPlayableTrackId = album.tracks.find(trackId => {
    const t = theme && theme.tracks ? theme.tracks.find(t => t.id === trackId) : null;
    return t && t.full_url;
  });
  const firstPlayableTrack = firstPlayableTrackId && theme ? theme.tracks.find(t => t.id === firstPlayableTrackId) : null;
  
  const playAction = firstPlayableTrack 
    ? `onclick="event.stopPropagation(); playTrack('${firstPlayableTrack.id}', '${firstPlayableTrack.title.replace(/'/g, "\\'")}', '${firstPlayableTrack.type}', ${firstPlayableTrack.duration}, '${album.art}')"` 
    : `style="cursor: not-allowed; opacity: 0.5;" title="音源がありません"`;

  return `
    <div class="group border border-gray-100 dark:border-[#333333] rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-400 transition bg-white dark:bg-[#242424] flex flex-col">
      <div class="relative cursor-pointer" onclick="selectAlbum('${themeId}', '${album.id}')">
        <div class="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src="${album.art}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Art" loading="lazy" decoding="async">
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
            <button class="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl text-gray-900 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" ${playAction}>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[15px] font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 z-10 pointer-events-none">
            <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            ${album.tracks.length}
          </div>
        </div>
      </div>
      <div class="p-4 pt-3 flex-1 flex flex-col justify-start cursor-pointer" onclick="selectAlbum('${themeId}', '${album.id}')">
        <div>
          <h3 class="font-bold text-gray-800 dark:text-gray-100 text-base line-clamp-1">${album.title}</h3>
        </div>
      </div>
    </div>
  `;
}

export function renderAlbumGrid(theme) {
  const mainContent = document.getElementById('main-content');
  if (!theme.albums || theme.albums.length === 0) {
    mainContent.innerHTML = `
      <div class="pt-4">
        <p class="text-gray-500 dark:text-gray-400 text-base">現在、このテーマにアルバムはありません。</p>
      </div>
    `;
    return;
  }

  const adHtml = state.data.settings?.ad_html || "";
  
  let contentHtml = "";

  if (theme.categories && theme.categories.length > 0) {
    theme.categories.forEach((category, index) => {
      contentHtml += `
        <div class="mb-10">
          <div class="flex items-baseline gap-3 mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">${category.name}</h2>
            ${category.caption ? `<p class="text-xs text-gray-500 dark:text-gray-400 font-medium">${category.caption}</p>` : ''}
          </div>
          <div class="grid grid-cols-1 @xs:grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-4 gap-3 @lg:gap-6">
      `;
      category.albums.forEach(albumId => {
        const album = theme.albums.find(a => a.id === albumId);
        if (album) {
          contentHtml += createAlbumCardHtml(theme.id, album);
        }
      });
      contentHtml += `
          </div>
        </div>
      `;

      if (adHtml) {
        if ((index + 1) % 3 === 0 || (theme.categories.length < 3 && index === theme.categories.length - 1)) {
          contentHtml += `<div class="mb-10">${adHtml}</div>`;
        }
      }
    });
  } else {
    let gridHtml = '';
    theme.albums.forEach((album) => {
      gridHtml += createAlbumCardHtml(theme.id, album);
    });
    contentHtml += `
      <div class="grid grid-cols-1 @xs:grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-4 gap-3 @lg:gap-6 mb-10">
        ${gridHtml}
      </div>
    `;
    if (adHtml) {
      contentHtml += `<div>${adHtml}</div>`;
    }
  }

  mainContent.innerHTML = contentHtml;
}

export function renderAlbumDetail(album) {
  const theme = state.data.themes.find(t => t.id === state.currentThemeId) || state.data.themes.find(t => t.albums.some(a => a.id === album.id));
  
  const tracksHtml = album.tracks.map((trackId) => {
    const track = theme && theme.tracks ? theme.tracks.find(t => t.id === trackId) : null;
    if (!track) return '';
    
    const isThisPlaying = state.playingTrack === track.id && state.isPlaying;
    const formatTime = (seconds) => {
      if (!seconds) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    // --- フェイルセーフ判定 ---
    const hasFull = !!track.full_url;

    // 再生ボタンのクラスとアクション（full_urlで判定）
    const playBtnClass = hasFull 
      ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer" 
      : "bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed";
    const playBtnAction = hasFull 
      ? `onclick="event.stopPropagation(); playTrack('${track.id}', '${track.title.replace(/'/g, "\\'")}', '${track.type}', ${track.duration}, '${album.art}')"` 
      : `title="音源がありません" disabled`;

    // FULLボタンのクラスとアクション
    const fullBtnClass = hasFull
      ? "text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition cursor-pointer"
      : "text-gray-200 dark:text-gray-700 cursor-not-allowed";
    const fullBtnAction = hasFull
      ? `onclick="event.stopPropagation(); downloadTrack('${track.full_url}', '${track.title.replace(/'/g, "\\'")}')"`
      : `title="フル音源がありません" disabled`;

    // --- タグの生成 ---
    const tagsHtml = (track.tags && track.tags.length > 0)
      ? `<div class="flex flex-wrap gap-1 mt-1.5">
           ${track.tags.map(tag => `<button onclick="searchByTag('${tag}')" class="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">#${tag}</button>`).join('')}
         </div>`
      : '';
      
    const rightSideActionHtml = state.isSelectMode
      ? `
        <div class="flex items-center justify-center w-12 h-12 cursor-pointer" onclick="toggleTrackSelection(event, '${track.id}')">
          <div class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${state.selectedTracks.has(track.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}">
            ${state.selectedTracks.has(track.id) ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : ''}
          </div>
        </div>
      `
      : `
        <button class="flex flex-col items-center justify-center w-12 h-12 ${fullBtnClass}" ${fullBtnAction}>
          <svg class="w-5 h-5 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          <span class="text-[10px] font-bold">DL</span>
        </button>
      `;
    
    return `
    <div class="flex items-center gap-3 md:gap-4 p-3 md:p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626] transition group ${state.isSelectMode ? 'cursor-pointer' : ''}" ${state.isSelectMode ? `onclick="toggleTrackSelection(event, '${track.id}')"` : ''}>
      <button class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${playBtnClass}" ${playBtnAction}>
        ${isThisPlaying 
          ? `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
          : `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`
        }
      </button>
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-[15px] md:text-base text-gray-900 dark:text-gray-100 truncate">${track.title}</h4>
        <p class="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 md:line-clamp-1">${track.caption || ''}</p>
        ${tagsHtml}
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="text-sm text-gray-400 dark:text-gray-500 font-mono hidden md:inline-block w-10 text-right">${formatTime(track.duration)}</span>
        <span class="text-xs font-mono text-gray-400 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded hidden md:inline-block">${track.type.toUpperCase()}</span>
        
        <button 
          class="flex flex-col items-center justify-center w-12 h-12 ${track.lyrics ? 'text-purple-500 hover:text-purple-700 dark:hover:text-purple-400 transition cursor-pointer' : 'text-gray-200 dark:text-gray-700 cursor-not-allowed'}" 
          ${track.lyrics ? `onclick="showLyrics('${track.title.replace(/'/g, "\\'")}', \`${track.lyrics.replace(/`/g, "\\`")}\`)"` : 'disabled'}
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-[10px] font-bold">LYRICS</span>
        </button>

        ${rightSideActionHtml}
      </div>
    </div>
  `}).join('');

  const themeName = state.data.themes.find(t => t.id === state.currentThemeId)?.name || '検索結果';
  
  // アルバムヘッダーの「Play」ボタン用のフェイルセーフ（full_url基準）
  const firstPlayableTrackId = album.tracks.find(trackId => {
    const t = theme && theme.tracks ? theme.tracks.find(t => t.id === trackId) : null;
    return t && t.full_url;
  });
  const firstPlayableTrack = firstPlayableTrackId && theme ? theme.tracks.find(t => t.id === firstPlayableTrackId) : null;
  
  let albumPlayBtnHtml = '';
  if (firstPlayableTrack) {
    albumPlayBtnHtml = `
      <button class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full text-[15px] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-sm flex items-center gap-2" onclick="playTrack('${firstPlayableTrack.id}', '${firstPlayableTrack.title.replace(/'/g, "\\'")}', '${firstPlayableTrack.type}', ${firstPlayableTrack.duration}, '${album.art}')">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        Play
      </button>
    `;
  } else {
    albumPlayBtnHtml = `
      <button class="bg-gray-300 dark:bg-gray-700 text-white dark:text-gray-500 px-6 py-2.5 rounded-full text-[15px] font-bold cursor-not-allowed shadow-sm flex items-center gap-2" title="再生可能な音源がありません" disabled>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        No Audio
      </button>
    `;
  }

  let zipDlBtnHtml = '';
  if (state.isSelectMode) {
    zipDlBtnHtml = `
      <button class="bg-blue-600 dark:bg-blue-500 text-white px-5 py-2.5 rounded-full text-[15px] font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-sm flex items-center gap-2 relative overflow-hidden" onclick="downloadSelectedZip('${album.id}', this)" ${state.selectedTracks.size === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
        <div class="absolute left-0 top-0 bottom-0 bg-blue-800 dark:bg-blue-700 w-0 transition-all duration-300 z-0" id="zip-progress-bar"></div>
        <span class="relative z-10 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          <span id="zip-progress-text">${state.selectedTracks.size}曲を保存</span>
        </span>
      </button>
      <button class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-5 py-2.5 rounded-full text-[15px] font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm" onclick="toggleSelectMode()">
        キャンセル
      </button>
    `;
  } else {
        zipDlBtnHtml = `
          <button class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-5 py-2.5 rounded-full text-[15px] font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm flex items-center gap-2 relative overflow-hidden" onclick="downloadAlbumZip('${album.id}', this)">
            <div class="absolute left-0 top-0 bottom-0 bg-gray-300 dark:bg-gray-600 w-0 transition-all duration-300 z-0" id="zip-progress-bar"></div>
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              <span id="zip-progress-text">まとめてDL</span>
            </span>
          </button>
          <button class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-5 py-2.5 rounded-full text-[15px] font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm flex items-center gap-2" onclick="toggleSelectMode()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            選択してDL
          </button>
        `;
      }

      const shareBtnHtml = `
        <button class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-[42px] h-[42px] rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm flex-shrink-0" onclick="shareAlbum('${album.title.replace(/'/g, "\\'")}')" title="このアルバムを共有">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </button>
      `;

      document.getElementById('main-content').innerHTML = `
    <div class="max-w-4xl mx-auto pb-10">
      <button class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6 hover:text-gray-900 dark:hover:text-gray-100 transition flex items-center gap-1" onclick="backToAlbums()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to ${state.searchQuery ? '検索結果' : themeName}
      </button>

      <div class="flex flex-col md:flex-row gap-6 md:gap-8 mb-10">
        <img src="${album.art}" class="w-48 h-48 md:w-56 md:h-56 object-cover rounded-xl shadow-md border border-gray-100 dark:border-gray-800 flex-shrink-0" alt="Album Art" loading="lazy" decoding="async">
        <div class="flex flex-col justify-end">
          <span class="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">Album</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">${album.title}</h2>
          <p class="text-[15px] text-gray-600 dark:text-gray-400 mb-1">${album.tracks.length} tracks • AI Generated BGM</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-3">${album.caption || ''}</p>
          <div class="flex flex-wrap items-center gap-3">
            ${albumPlayBtnHtml}
            ${zipDlBtnHtml}
            ${shareBtnHtml}
          </div>
        </div>
      </div>

      <div class="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-[#242424]">
        ${tracksHtml}
      </div>
    </div>
  `;
}
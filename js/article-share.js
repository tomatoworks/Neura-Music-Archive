// js/article-share.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('share-container');
  if (!container) return;

  // 1. シェア用URLの取得
  // iframe内で表示されている場合、親ウィンドウ（SPA本体）のURLを取得する
  let shareUrl = window.location.href;
  try {
    if (window.parent !== window) {
      shareUrl = window.parent.location.href;
    }
  } catch (e) {
    console.warn("親ウィンドウのURL取得に失敗したため、現在のURLを使用します", e);
  }

  // 2. タイトルの取得
  // 優先順位: 1. og:title, 2. titleタグ, 3. h1タグ
  let shareTitle = document.title;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const h1 = document.querySelector('h1');
  
  if (ogTitle && ogTitle.content) {
    shareTitle = ogTitle.content;
  } else if (h1) {
    shareTitle = h1.innerText;
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  // 3. 各SNSのシェアリンク生成
  const xUrl = `https://twitter.com/share?url=${encodedUrl}&text=${encodedTitle}`;
  const bskyUrl = `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;

  // 4. UIの構築と挿入
  container.innerHTML = `
    <hr class="border-slate-200 dark:border-zinc-800 my-8">
    <section id="share" class="space-y-4">
      <div class="space-y-1">
        <h2 class="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-tight flex items-center gap-2">
          Share This Article
        </h2>
        <p class="text-xs text-slate-500 dark:text-zinc-400">
          この記事が役立ちましたら、SNS等でのシェアをお願いいたします。
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        <a href="${xUrl}" target="_blank" rel="noopener noreferrer"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 transition-all text-xs font-semibold text-slate-800 dark:text-zinc-200">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-4.717 5.392L22.42 22.5h-6.653l-5.207-8.7-5.962 8.7H1.368l5.221-5.972L1.252 2.25h6.823l4.7 6.22 5.469-6.22H18.244zM17.08 20.528h1.832L7.08 4.145H5.113L17.08 20.528z"/>
          </svg>
          X (Twitter)
        </a>

        <a href="${bskyUrl}" target="_blank" rel="noopener noreferrer"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 transition-all text-xs font-semibold text-slate-800 dark:text-zinc-200">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M111.8 77.2C151.7 114.7 197.8 181 228.6 226.6c2.7 4 4.1 8.8 4.1 13.7v10.5c0 4.9-1.4 9.7-4.1 13.7-30.8 45.6-76.9 111.9-116.8 149.4C71.7 451.3 16 480 16 381.1c0-43.6 27.5-84.4 69.4-106C42.8 253.5 16 212.7 16 169.1 16 70.2 71.7 99 111.8 77.2zm288.4 0c40.1 21.8 95.8-7 95.8 91.9 0 43.6-26.8 84.4-69.4 106 41.9 21.6 69.4 62.4 69.4 106 0 98.9-55.7 70.2-95.8 132.8-39.9-37.5-86-103.8-116.8-149.4-2.7-4-4.1-8.8-4.1-13.7V250.8c0-4.9 1.4-9.7 4.1-13.7 30.8-45.6 76.9-111.9 116.8-149.4z"/>
          </svg>
          Bluesky
        </a>

        <a href="${lineUrl}" target="_blank" rel="noopener noreferrer"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 transition-all text-xs font-semibold text-slate-800 dark:text-zinc-200">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 5.518 2 9.854c0 3.864 3.54 7.105 8.318 7.734.324.07.765.214.876.544.1.298.066.764.032 1.066l-.141 1.012c-.042.302-.204 1.18 1.135.534 1.338-.646 5.865-3.486 7.994-5.967C21.36 13.568 22 11.815 22 9.854 22 5.518 17.52 2 12 2zm4.184 10.155h-1.285a.311.311 0 01-.311-.311V7.935a.311.311 0 01.311-.311h1.285a.311.311 0 01.311.311v1.909h1.018a.311.311 0 01.311.311v1.1c0 .17-.14.31-.311.31h-1.319zm-3.099 0h-1.285a.311.311 0 01-.311-.311V7.935a.311.311 0 01.311-.311h1.285a.311.311 0 01.311.311v3.909c0 .17-.14.31-.311.31zm-2.091 0h-1.285a.311.311 0 01-.311-.311v-1.78l-1.422-2.1c-.046-.07-.055-.16-.02-.23.036-.08.115-.13.2-.13h1.285a.311.311 0 01.258.156l.872 1.411V7.935c0-.17.14-.31.311-.31h1.285c.17 0 .31.14.31.311v3.909c0 .17-.14.31-.31.31h-.28zm-4.708 0H5h-1.285a.311.311 0 01-.311-.311V7.935a.311.311 0 01.311-.311h1.285a.311.311 0 01.311.311v1.909h1.018c.17 0 .31.14.31.311v1.1c0 .17-.14.31-.311.31z"/>
          </svg>
          LINE
        </a>

        <button onclick="window.copyArticleShareLink(this)" data-share-url="${shareUrl}"
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 transition-all text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span class="share-btn-text">Copy Link</span>
        </button>
      </div>
    </section>
  `;

  // 5. グローバル関数としてコピースクリプトを定義
  window.copyArticleShareLink = function(button) {
    const url = button.getAttribute('data-share-url') || shareUrl;
    
    // テキストコピーの実行
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = url;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    
    let copied = false;
    try {
      document.execCommand('copy');
      copied = true;
    } catch (err) {
      navigator.clipboard.writeText(url).then(() => {
        copied = true;
      }).catch(() => {
        copied = false;
      });
    }
    document.body.removeChild(tempTextArea);

    // UIフィードバックの適用
    const btnText = button.querySelector('.share-btn-text');
    const originalText = btnText.innerText;
    
    if (copied) {
      btnText.innerText = "Copied!";
      button.classList.add("border-emerald-500", "text-emerald-500", "dark:border-emerald-600", "dark:text-emerald-400");
      button.classList.remove("border-slate-200", "dark:border-zinc-800");
      
      setTimeout(() => {
        btnText.innerText = originalText;
        button.classList.remove("border-emerald-500", "text-emerald-500", "dark:border-emerald-600", "dark:text-emerald-400");
        button.classList.add("border-slate-200", "dark:border-zinc-800");
      }, 2000);
    }
  };
});
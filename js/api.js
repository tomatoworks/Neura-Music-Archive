export async function fetchSiteData(onProgress) {
  const urlParams = new URLSearchParams(window.location.search);
  const isPreview = urlParams.get('preview') === 'true';

  if (isPreview) {
    return new Promise((resolve) => {
      if (window._hydratedSiteData) {
        return resolve(window._hydratedSiteData);
      }
      
      const messageHandler = (event) => {
        if (event.data && event.data.type === 'HYDRATE_SITE_DATA') {
          window.removeEventListener('message', messageHandler);
          window._hydratedSiteData = event.data.payload;
          resolve(event.data.payload);
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      setTimeout(() => {
        if (!window._hydratedSiteData) {
          console.warn("Hydration timeout");
          resolve({ settings: {}, themes: [], pagesData: {} });
        }
      }, 5000);
    });
  }

  let dataPath = urlParams.get('dataPath');
  if (dataPath) {
    dataPath = dataPath.replace(/\/$/, '');
  } else {
    dataPath = '/data';
  }

  try {
    const manifestRes = await fetch(`${dataPath}/manifest.json`);
    if (!manifestRes.ok) {
      throw new Error(`Manifest fetch error: ${manifestRes.status}`);
    }
    const manifest = await manifestRes.json();

    let settings = {};
    if (manifest.settings_file) {
      const settingsRes = await fetch(`${dataPath}/${manifest.settings_file}`);
      if (settingsRes.ok) {
        settings = await settingsRes.json();
      }
    }

    const themes = [];
    if (manifest.theme_files && manifest.theme_files.length > 0) {
      manifest.theme_files.forEach(meta => {
        themes.push({
          id: meta.id,
          name: meta.name,
          fileName: meta.fileName,
          albums: [],
          tracks: [],
          categories: []
        });
      });

      const firstThemeMeta = manifest.theme_files[0];
      try {
        const res = await fetch(`${dataPath}/${firstThemeMeta.fileName}`);
        if (res.ok) {
          Object.assign(themes[0], await res.json());
        }
      } catch (e) {
        console.warn(`Failed to fetch theme file: ${firstThemeMeta.fileName}`, e);
      }

      if (manifest.theme_files.length > 1) {
        const remainingMetas = manifest.theme_files.slice(1);
        setTimeout(async () => {
          for (let i = 0; i < remainingMetas.length; i++) {
            const meta = remainingMetas[i];
            const themeIndex = i + 1;
            try {
              const res = await fetch(`${dataPath}/${meta.fileName}`);
              if (res.ok) {
                Object.assign(themes[themeIndex], await res.json());
                if (onProgress) onProgress();
              }
            } catch (e) {
              console.warn(`Failed to fetch theme file: ${meta.fileName}`, e);
            }
          }
        }, 0);
      }
    }

    let pagesData = {};
    try {
      const pagesRes = await fetch(`${dataPath}/pages.json`);
      if (pagesRes.ok) pagesData = await pagesRes.json();
    } catch (e) {
      console.warn("Pages data not found");
    }

    const tools = manifest.tools || [];
    const articles = manifest.articles || [];

    return {
      settings,
      themes,
      pagesData,
      tools,
      articles
    };

  } catch (error) {
    console.error("Failed to fetch site data:", error);
    return { settings: {}, themes: [] };
  }
}

export function filterTracksBySearch(themes, query) {
  if (!query) return [];
  
  const keywords = query.toLowerCase().replace(/　/g, ' ').split(/\s+/).filter(k => k.length > 0);
  if (keywords.length === 0) return [];

  const searchResults = [];
  
  themes.forEach(theme => {
    if (!theme.albums) return;
    theme.albums.forEach(album => {
      album.tracks.forEach(trackId => {
        const track = theme.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        const isMatch = keywords.every(keyword => {
          const matchTrackTitle = track.title.toLowerCase().includes(keyword);
          const matchTrackCaption = track.caption && track.caption.toLowerCase().includes(keyword);
          const matchTrackTags = track.tags && track.tags.some(tag => tag.toLowerCase().includes(keyword));
          const matchAlbumTitle = album.title.toLowerCase().includes(keyword);
          
          return matchTrackTitle || matchTrackCaption || matchTrackTags || matchAlbumTitle;
        });

        if (isMatch) {
          searchResults.push({ themeId: theme.id, album, track });
        }
      });
    });
  });
  
  const uniqueResults = [];
  const trackIds = new Set();
  searchResults.forEach(result => {
    if (!trackIds.has(result.track.id)) {
      trackIds.add(result.track.id);
      uniqueResults.push(result);
    }
  });
  
  return uniqueResults;
}
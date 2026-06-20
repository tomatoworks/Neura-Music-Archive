const state = {
    width: 1920,
    height: 1080,
    fontFamily: "'Noto Sans JP', sans-serif",
    themeColor: "#ef4444",
    useGradient: false,
    themeColor2: "#3b82f6",
    gradientAngle: 45,
    
    frame: {
        enabled: true,
        style: "simple",
        width: 4,
        radius: 16,
        padding: 10,
        anim: "none" 
    },
    
    channel: {
        enabled: true,
        text: "MY STREAM CHANNEL",
        pos: "top", 
        size: 24,
        offsetX: 50,
        offsetY: 0,
        fontFamily: "'Noto Sans JP', sans-serif",
        color: "#ef4444"
    },
    
    sns: {
        enabled: true,
        pos: "right", 
        size: 16,
        padding: 12,
        margin: 30,
        fontFamily: "'Noto Sans JP', sans-serif",
        color: "#ffffff",
        list: {
            X: { enabled: true, val: "@MyChannel" },
            YT: { enabled: true, val: "MyStreamChannel" },
            Twitch: { enabled: false, val: "mystreamer" },
            IG: { enabled: false, val: "my_insta" },
            TikTok: { enabled: false, val: "mytiktok" },
            Custom: { enabled: false, val: "discord.gg/mystream" }
        }
    },
    
    wipe: {
        enabled: true,
        pos: "top-right", 
        aspect: "16-9", 
        width: 400,
        margin: 30,
        textTop: "LIVE CAMERA",
        textBottom: "",
        textSize: 14,
        fontFamily: "'Noto Sans JP', sans-serif",
        color: "#ef4444",
        matchMain: true 
    },
    
    clock: {
        enabled: true,
        pos: "top-left", 
        size: 32,
        margin: 20,
        showLive: true,
        customHTML: "",
        fontFamily: "'Orbitron', sans-serif",
        color: "#ef4444"
    },
    
    ticker: {
        enabled: true,
        text1: "【お知らせ】チャンネル登録者2000人突破！いつも温かい応援本当にありがとうございます！",
        text2: "お気軽にコメント＆フォローしてくださいね！",
        text3: "",
        bgEnabled: true,
        pos: "bottom", 
        width: 80, 
        bgOpacity: 60, 
        speed: 20, 
        fontFamily: "'Noto Sans JP', sans-serif",
        size: 20,
        color: "#ffffff"
    },
    
    qr: {
        enabled: true,
        pos: "bottom-left", 
        width: 150,
        margin: 30,
        matchMain: true,
        interval: 10,
        anim: "fade", 
        list: [
            { url: "https://example.com", label: "My Website", color1: "#000000", color2: "#000000", logo: "none" },
            { url: "", label: "", color1: "#000000", color2: "#000000", logo: "none" },
            { url: "", label: "", color1: "#000000", color2: "#000000", logo: "none" }
        ]
    }
};

window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'clock_resize') {
        const iframe = document.getElementById('clockIframe');
        if (iframe) {
            iframe.style.width = e.data.width + 'px';
            iframe.style.height = e.data.height + 'px';
        }
    }
});

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('animate-[fadeIn_0.3s_ease-out]');
    });
    
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-[var(--accent-color)]', 'text-black', 'shadow-[0_4px_15px_rgba(239,68,68,0.4)]');
        el.classList.add('bg-[#222]', 'text-[var(--text-sub)]');
    });

    const content = document.getElementById(`tabContent-${tabId}`);
    if(content) {
        content.classList.remove('hidden');
        content.classList.add('animate-[fadeIn_0.3s_ease-out]');
    }

    const btn = document.getElementById(`tabBtn-${tabId}`);
    if(btn) {
        btn.classList.remove('bg-[#222]', 'text-[var(--text-sub)]');
        btn.classList.add('bg-[var(--accent-color)]', 'text-black', 'shadow-[0_4px_15px_rgba(239,68,68,0.4)]');
    }
}

function updateFromInputs() {
    state.width = parseInt(document.getElementById("resWidth").value) || 1920;
    state.height = parseInt(document.getElementById("resHeight").value) || 1080;
    state.fontFamily = document.getElementById("globalFont").value;
    state.themeColor = document.getElementById("themeColor").value;
    state.useGradient = document.getElementById("useGradient").checked;
    state.themeColor2 = document.getElementById("themeColor2").value;
    state.gradientAngle = parseInt(document.getElementById("gradientAngle").value) || 45;

    document.getElementById("gradientSettings").style.opacity = state.useGradient ? "1" : "0.4";
    document.getElementById("gradientSettings").style.pointerEvents = state.useGradient ? "auto" : "none";

    state.frame.enabled = document.getElementById("frameEnabled").checked;
    state.frame.style = document.getElementById("frameStyle").value;
    state.frame.width = parseInt(document.getElementById("frameWidth").value) || 4;
    state.frame.radius = parseInt(document.getElementById("frameRadius").value) || 0;
    state.frame.padding = parseInt(document.getElementById("framePadding").value) || 0;
    state.frame.anim = document.getElementById("frameAnim").value;

    document.getElementById("frameWidthVal").textContent = state.frame.width;
    document.getElementById("frameRadiusVal").textContent = state.frame.radius;
    document.getElementById("framePaddingVal").textContent = state.frame.padding;
    document.getElementById("frameSettings").style.opacity = state.frame.enabled ? "1" : "0.4";
    document.getElementById("frameSettings").style.pointerEvents = state.frame.enabled ? "auto" : "none";

    state.channel.enabled = document.getElementById("channelEnabled").checked;
    state.channel.text = document.getElementById("channelText").value;
    state.channel.fontFamily = document.getElementById("channelFont").value;
    state.channel.size = parseInt(document.getElementById("channelSize").value) || 24;
    state.channel.color = document.getElementById("channelColor").value;
    state.channel.offsetX = parseInt(document.getElementById("channelOffsetX").value) || 50;
    state.channel.offsetY = parseInt(document.getElementById("channelOffsetY").value) || 0;

    document.getElementById("channelSettings").style.opacity = state.channel.enabled ? "1" : "0.4";
    document.getElementById("channelSettings").style.pointerEvents = state.channel.enabled ? "auto" : "none";

    state.sns.enabled = document.getElementById("snsEnabled").checked;
    state.sns.pos = document.getElementById("snsPos").value;
    state.sns.margin = parseInt(document.getElementById("snsMargin").value) || 30;
    state.sns.fontFamily = document.getElementById("snsFont").value;
    state.sns.size = parseInt(document.getElementById("snsSize").value) || 16;
    state.sns.color = document.getElementById("snsColor").value;
    state.sns.padding = parseInt(document.getElementById("snsPadding").value) || 12;
    document.getElementById("snsPaddingVal").textContent = state.sns.padding;

    const snsKeys = ["X", "YT", "Twitch", "IG", "TikTok", "Custom"];
    snsKeys.forEach(key => {
        state.sns.list[key].enabled = document.getElementById(`snsUse${key}`).checked;
        state.sns.list[key].val = document.getElementById(`snsVal${key}`).value;
    });

    document.getElementById("snsSettings").style.opacity = state.sns.enabled ? "1" : "0.4";
    document.getElementById("snsSettings").style.pointerEvents = state.sns.enabled ? "auto" : "none";

    state.wipe.enabled = document.getElementById("wipeEnabled").checked;
    state.wipe.pos = document.getElementById("wipePos").value;
    state.wipe.aspect = document.getElementById("wipeAspect").value;
    state.wipe.width = parseInt(document.getElementById("wipeWidth").value) || 400;
    state.wipe.margin = parseInt(document.getElementById("wipeMargin").value) || 30;
    state.wipe.textTop = document.getElementById("wipeTextTop").value;
    state.wipe.textBottom = document.getElementById("wipeTextBottom").value;
    state.wipe.textSize = parseInt(document.getElementById("wipeTextSize").value) || 14;
    state.wipe.fontFamily = document.getElementById("wipeFont").value;
    state.wipe.color = document.getElementById("wipeColor").value;
    state.wipe.matchMain = document.getElementById("wipeMatchMain").checked;

    document.getElementById("wipeSettings").style.opacity = state.wipe.enabled ? "1" : "0.4";
    document.getElementById("wipeSettings").style.pointerEvents = state.wipe.enabled ? "auto" : "none";

    state.clock.enabled = document.getElementById("clockEnabled").checked;
    state.clock.pos = document.getElementById("clockPos").value;
    state.clock.size = parseInt(document.getElementById("clockSize").value) || 32;
    state.clock.margin = parseInt(document.getElementById("clockMargin").value) || 20;
    state.clock.showLive = document.getElementById("clockShowLive").checked;
    state.clock.customHTML = document.getElementById("clockHTML").value;
    state.clock.fontFamily = document.getElementById("clockFont").value;
    state.clock.color = document.getElementById("clockColor").value;

    const isClockCustom = state.clock.customHTML.trim() !== "";
    document.getElementById("clockSize").disabled = isClockCustom;
    document.getElementById("clockFont").disabled = isClockCustom;
    document.getElementById("clockColor").disabled = isClockCustom;
    document.getElementById("clockShowLive").disabled = isClockCustom;

    document.getElementById("clockSettings").style.opacity = state.clock.enabled ? "1" : "0.4";
    document.getElementById("clockSettings").style.pointerEvents = state.clock.enabled ? "auto" : "none";

    state.ticker.enabled = document.getElementById("tickerEnabled").checked;
    state.ticker.text1 = document.getElementById("tickerText1").value;
    state.ticker.text2 = document.getElementById("tickerText2").value;
    state.ticker.text3 = document.getElementById("tickerText3").value;
    state.ticker.bgEnabled = document.getElementById("tickerBgEnabled").checked;
    state.ticker.pos = document.getElementById("tickerPos").value;
    state.ticker.width = parseInt(document.getElementById("tickerWidth").value) || 80;
    state.ticker.bgOpacity = parseInt(document.getElementById("tickerBgOpacity").value) || 60;
    state.ticker.speed = parseInt(document.getElementById("tickerSpeed").value) || 20;
    state.ticker.fontFamily = document.getElementById("tickerFont").value;
    state.ticker.size = parseInt(document.getElementById("tickerSize").value) || 20;
    state.ticker.color = document.getElementById("tickerColor").value;

    document.getElementById("tickerWidthVal").textContent = state.ticker.width;
    document.getElementById("tickerBgOpacityVal").textContent = state.ticker.bgOpacity;
    document.getElementById("tickerSettings").style.opacity = state.ticker.enabled ? "1" : "0.4";
    document.getElementById("tickerSettings").style.pointerEvents = state.ticker.enabled ? "auto" : "none";

    state.qr.enabled = document.getElementById("qrEnabled").checked;
    state.qr.pos = document.getElementById("qrPos").value;
    state.qr.width = parseInt(document.getElementById("qrWidth").value) || 150;
    state.qr.margin = parseInt(document.getElementById("qrMargin").value) || 30;
    state.qr.matchMain = document.getElementById("qrMatchMain").checked;
    state.qr.interval = parseInt(document.getElementById("qrInterval").value) || 10;
    state.qr.anim = document.getElementById("qrAnim").value;
    
    for (let i = 1; i <= 3; i++) {
        state.qr.list[i-1].url = document.getElementById(`qrUrl${i}`).value;
        state.qr.list[i-1].label = document.getElementById(`qrLabel${i}`).value;
        state.qr.list[i-1].color1 = document.getElementById(`qrColor${i}_1`).value;
        state.qr.list[i-1].color2 = document.getElementById(`qrColor${i}_2`).value;
        state.qr.list[i-1].logo = document.getElementById(`qrLogo${i}`).value;
    }

    document.getElementById("qrSettings").style.opacity = state.qr.enabled ? "1" : "0.4";
    document.getElementById("qrSettings").style.pointerEvents = state.qr.enabled ? "auto" : "none";

    renderPreview();
}

function getGradientDef(id, c1, c2, angle) {
    const rad = angle * (Math.PI / 180);
    let x1, y1, x2, y2;
    if (angle >= 0 && angle < 90) { x1 = 0; y1 = 0; x2 = 1; y2 = 1; }
    else if (angle >= 90 && angle < 180) { x1 = 1; y1 = 0; x2 = 0; y2 = 1; }
    else if (angle >= 180 && angle < 270) { x1 = 1; y1 = 1; x2 = 0; y2 = 0; }
    else { x1 = 0; y1 = 1; x2 = 1; y2 = 0; }
    
    return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
    </linearGradient>`;
}

let currentQrIdx = 0;
let qrIntervalTimer = null;

function renderPreview() {
    const viewport = document.getElementById("canvasViewport");
    const container = document.getElementById("previewContainer");
    
    viewport.style.width = `${state.width}px`;
    viewport.style.height = `${state.height}px`;

    const scaleX = container.clientWidth / state.width;
    const scaleY = container.clientHeight / state.height;
    const scale = Math.min(scaleX, scaleY) * 0.95; 

    viewport.style.transform = `translate(-50%, -50%) scale(${scale})`;

    const svgLayer = document.getElementById("svgFrameLayer");
    let svgDefs = `<defs>`;
    
    let mainColorAttr = `stroke="${state.themeColor}"`;
    if (state.useGradient) {
        svgDefs += getGradientDef("mainGrad", state.themeColor, state.themeColor2, state.gradientAngle);
        mainColorAttr = `stroke="url(#mainGrad)"`;
    }
    
    svgDefs += `
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>`;

    let svgContent = svgDefs;
    
    if (state.frame.enabled) {
        const p = state.frame.padding;
        const w = state.width - (p * 2);
        const h = state.height - (p * 2);
        const r = state.frame.radius;
        const fw = state.frame.width;
        
        let styleStr = "";
        if (state.frame.anim === "pulse") {
            styleStr = `animation: pulse-anim 2s infinite;`;
        } else if (state.frame.anim === "flow") {
            styleStr = `stroke-dasharray: 100 20; animation: march-border 2s linear infinite;`;
        }

        if (state.frame.style === "simple") {
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" ${mainColorAttr} stroke-width="${fw}" style="${styleStr}"></rect>`;
        } else if (state.frame.style === "double") {
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" ${mainColorAttr} stroke-width="${fw}" style="${styleStr}"></rect>`;
            svgContent += `<rect x="${p + fw + 4}" y="${p + fw + 4}" width="${w - (fw*2) - 8}" height="${h - (fw*2) - 8}" rx="${Math.max(0, r-4)}" ry="${Math.max(0, r-4)}" fill="none" ${mainColorAttr} stroke-width="${fw/2}" opacity="0.6" style="${styleStr}"></rect>`;
        } else if (state.frame.style === "neon") {
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" ${mainColorAttr} stroke-width="${fw}" filter="url(#neonGlow)" style="${styleStr}"></rect>`;
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" stroke="#fff" stroke-width="${fw/2}"></rect>`;
        } else if (state.frame.style === "dashed") {
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" ${mainColorAttr} stroke-width="${fw}" stroke-dasharray="${fw*3} ${fw*3}" style="${styleStr}"></rect>`;
        } else if (state.frame.style === "corners") {
            const cl = 60; 
            const d = `M ${p},${p+cl} L ${p},${p} L ${p+cl},${p} 
                       M ${p+w-cl},${p} L ${p+w},${p} L ${p+w},${p+cl} 
                       M ${p+w},${p+h-cl} L ${p+w},${p+h} L ${p+w-cl},${p+h} 
                       M ${p+cl},${p+h} L ${p},${p+h} L ${p},${p+h-cl}`;
            svgContent += `<path d="${d}" fill="none" ${mainColorAttr} stroke-width="${fw}" stroke-linejoin="round" style="${styleStr}"></path>`;
        } else if (state.frame.style === "brackets") {
            const cl = 100;
            const d = `M ${p+cl},${p} L ${p},${p} L ${p},${p+h} L ${p+cl},${p+h} 
                       M ${p+w-cl},${p} L ${p+w},${p} L ${p+w},${p+h} L ${p+w-cl},${p+h}`;
            svgContent += `<path d="${d}" fill="none" ${mainColorAttr} stroke-width="${fw}" stroke-linejoin="round" style="${styleStr}"></path>`;
        } else if (state.frame.style === "cinema") {
            svgContent += `<rect x="0" y="0" width="${state.width}" height="${state.height*0.1}" fill="#000"></rect>`;
            svgContent += `<rect x="0" y="${state.height*0.9}" width="${state.width}" height="${state.height*0.1}" fill="#000"></rect>`;
            svgContent += `<line x1="0" y1="${state.height*0.1}" x2="${state.width}" y2="${state.height*0.1}" ${mainColorAttr} stroke-width="${fw}" style="${styleStr}"></line>`;
            svgContent += `<line x1="0" y1="${state.height*0.9}" x2="${state.width}" y2="${state.height*0.9}" ${mainColorAttr} stroke-width="${fw}" style="${styleStr}"></line>`;
        }
    }
    
    svgLayer.innerHTML = svgContent;

    const overlayChannel = document.getElementById("overlayChannel");
    if (state.channel.enabled && state.channel.text.trim() !== "") {
        overlayChannel.style.display = "block";
        overlayChannel.textContent = state.channel.text;
        overlayChannel.style.fontFamily = state.channel.fontFamily;
        overlayChannel.style.fontSize = `${state.channel.size}px`;
        overlayChannel.style.color = state.channel.color;
        
        overlayChannel.style.top = "auto";
        overlayChannel.style.bottom = "auto";
        
        const pad = state.frame.enabled ? state.frame.padding : 0;
        
        if (state.channel.pos === "top") {
            overlayChannel.style.top = `${pad + state.channel.offsetY}px`;
        } else if (state.channel.pos === "bottom") {
            overlayChannel.style.bottom = `${pad + state.channel.offsetY}px`;
        } else if (state.channel.pos === "center") {
            overlayChannel.style.top = `calc(50% + ${state.channel.offsetY}px)`;
            overlayChannel.style.transform = "translate(-50%, -50%)";
        }
        
        overlayChannel.style.left = `${state.channel.offsetX}%`;
        if (state.channel.pos !== "center") {
            overlayChannel.style.transform = "translateX(-50%)";
        }
    } else {
        overlayChannel.style.display = "none";
    }

    const overlaySns = document.getElementById("overlaySns");
    if (state.sns.enabled) {
        overlaySns.style.display = "flex";
        overlaySns.style.fontFamily = state.sns.fontFamily;
        overlaySns.style.fontSize = `${state.sns.size}px`;
        overlaySns.style.color = state.sns.color;
        overlaySns.style.padding = `${state.sns.padding}px ${state.sns.padding * 2}px`;

        const sIcons = {
            X: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
            YT: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
            Twitch: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>`,
            IG: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
            TikTok: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.43 5.92-1.54 1.48-3.66 2.24-5.83 2.15-2.31-.09-4.52-1.21-5.74-3.14-1.18-1.85-1.39-4.25-.66-6.31.75-2.11 2.53-3.79 4.71-4.32 2.17-.53 4.54-.15 6.43.91V6.52c-1.8-.82-3.83-1.1-5.81-.8-2.02.3-3.88 1.44-4.99 3.09-1.07 1.6-1.37 3.65-1.01 5.56.36 1.88 1.45 3.55 3.01 4.56 1.55 1.01 3.48 1.34 5.31 1.02 1.87-.33 3.51-1.45 4.52-3.05 1.03-1.62 1.36-3.63 1.14-5.55-.06-1.78-.01-3.55-.04-5.33-.03-2.12-.02-4.23-.03-6.35Z"/></svg>`,
            Custom: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
        };

        let snsHtml = "";
        const keys = ["X", "YT", "Twitch", "IG", "TikTok", "Custom"];
        keys.forEach(k => {
            if (state.sns.list[k].enabled && state.sns.list[k].val) {
                snsHtml += `<div class="flex items-center gap-2">${sIcons[k]}<span>${state.sns.list[k].val}</span></div>`;
            }
        });
        overlaySns.innerHTML = snsHtml;

        overlaySns.style.top = "auto";
        overlaySns.style.bottom = "auto";
        overlaySns.style.left = "auto";
        overlaySns.style.right = "auto";
        overlaySns.style.transform = "none";
        
        const pad = state.frame.enabled ? state.frame.padding : 0;
        const m = pad + state.sns.margin;
        
        if (state.sns.pos === "top") {
            overlaySns.style.flexDirection = "row";
            overlaySns.style.top = `${m}px`;
            overlaySns.style.left = "50%";
            overlaySns.style.transform = "translateX(-50%)";
        } else if (state.sns.pos === "bottom") {
            overlaySns.style.flexDirection = "row";
            overlaySns.style.bottom = `${m}px`;
            overlaySns.style.left = "50%";
            overlaySns.style.transform = "translateX(-50%)";
        } else if (state.sns.pos === "left") {
            overlaySns.style.flexDirection = "column";
            overlaySns.style.left = `${m}px`;
            overlaySns.style.top = "50%";
            overlaySns.style.transform = "translateY(-50%)";
        } else if (state.sns.pos === "right") {
            overlaySns.style.flexDirection = "column";
            overlaySns.style.right = `${m}px`;
            overlaySns.style.top = "50%";
            overlaySns.style.transform = "translateY(-50%)";
        }
    } else {
        overlaySns.style.display = "none";
    }

    const overlayWipe = document.getElementById("overlayWipe");
    if (state.wipe.enabled) {
        overlayWipe.style.display = "block";
        overlayWipe.style.width = `${state.wipe.width}px`;
        
        let aspectR = 16/9;
        if (state.wipe.aspect === "4-3") aspectR = 4/3;
        else if (state.wipe.aspect === "1-1") aspectR = 1;
        
        overlayWipe.style.height = `${state.wipe.width / aspectR}px`;
        
        let borderC = state.wipe.matchMain ? state.themeColor : state.wipe.color;
        let borderW = state.wipe.matchMain && state.frame.enabled ? state.frame.width : 2;
        overlayWipe.style.border = `${borderW}px solid ${borderC}`;
        
        if (state.wipe.matchMain && state.useGradient) {
            overlayWipe.style.borderImage = `linear-gradient(${state.gradientAngle}deg, ${state.themeColor}, ${state.themeColor2}) 1`;
        } else {
            overlayWipe.style.borderImage = "none";
        }
        
        if (state.wipe.matchMain && state.frame.enabled && state.frame.radius > 0) {
            overlayWipe.style.borderRadius = `${state.frame.radius}px`;
            overlayWipe.style.borderImage = "none"; 
        } else {
            overlayWipe.style.borderRadius = "0px";
        }

        const topBanner = document.getElementById("wipeTopBanner");
        if (state.wipe.textTop.trim() !== "") {
            topBanner.style.display = "block";
            topBanner.textContent = state.wipe.textTop;
            topBanner.style.fontFamily = state.wipe.fontFamily;
            topBanner.style.fontSize = `${state.wipe.textSize}px`;
            topBanner.style.color = state.wipe.color;
        } else {
            topBanner.style.display = "none";
        }

        const bottomBanner = document.getElementById("wipeBottomBanner");
        if (state.wipe.textBottom.trim() !== "") {
            bottomBanner.style.display = "block";
            bottomBanner.textContent = state.wipe.textBottom;
            bottomBanner.style.fontFamily = state.wipe.fontFamily;
            bottomBanner.style.fontSize = `${state.wipe.textSize}px`;
            bottomBanner.style.color = state.wipe.color;
        } else {
            bottomBanner.style.display = "none";
        }

        overlayWipe.style.top = "auto";
        overlayWipe.style.bottom = "auto";
        overlayWipe.style.left = "auto";
        overlayWipe.style.right = "auto";
        
        const pad = state.frame.enabled ? state.frame.padding : 0;
        const m = pad + state.wipe.margin;
        
        if (state.wipe.pos === "top-left") {
            overlayWipe.style.top = `${m}px`;
            overlayWipe.style.left = `${m}px`;
        } else if (state.wipe.pos === "top-right") {
            overlayWipe.style.top = `${m}px`;
            overlayWipe.style.right = `${m}px`;
        } else if (state.wipe.pos === "bottom-left") {
            overlayWipe.style.bottom = `${m}px`;
            overlayWipe.style.left = `${m}px`;
        } else if (state.wipe.pos === "bottom-right") {
            overlayWipe.style.bottom = `${m}px`;
            overlayWipe.style.right = `${m}px`;
        }
    } else {
        overlayWipe.style.display = "none";
    }

    const overlayClock = document.getElementById("overlayClock");
    if (state.clock.enabled) {
        overlayClock.style.display = "block";
        overlayClock.style.color = state.clock.color;
        overlayClock.style.fontFamily = state.clock.fontFamily;

        if (state.clock.pos === "top-left") overlayClock.style.transformOrigin = "top left";
        else if (state.clock.pos === "top-right") overlayClock.style.transformOrigin = "top right";
        else if (state.clock.pos === "bottom-left") overlayClock.style.transformOrigin = "bottom left";
        else if (state.clock.pos === "bottom-right") overlayClock.style.transformOrigin = "bottom right";
        
        if (state.clock.customHTML.trim() !== "") {
            const scaleValue = state.clock.size / 32;
            overlayClock.style.transform = `scale(${scaleValue})`;
            overlayClock.style.fontSize = "";

            const hash = state.clock.customHTML + state.clock.color + state.clock.fontFamily;
            if (overlayClock.dataset.customHtmlHash !== hash) {
                overlayClock.dataset.customHtmlHash = hash;
                
                let rawHtml = state.clock.customHTML;
                let iframeContent = "";

                if (rawHtml.toLowerCase().includes("<html")) {
                    const injectCss = `<style>html, body { margin: 0 !important; padding: 0 !important; width: fit-content !important; height: fit-content !important; background: transparent !important; overflow: hidden !important; }</style></head>`;
                    if (/<\/head>/i.test(rawHtml)) {
                        rawHtml = rawHtml.replace(/<\/head>/i, injectCss);
                    } else {
                        rawHtml = rawHtml.replace(/<html[^>]*>/i, `$&<head>${injectCss}`);
                    }
                    
                    const injectJs = `<script>
                        const ro = new ResizeObserver(() => { 
                            window.parent.postMessage({ type: 'clock_resize', width: document.body.scrollWidth + 2, height: document.body.scrollHeight + 2 }, '*'); 
                        }); 
                        ro.observe(document.body);
                        setTimeout(() => window.parent.postMessage({ type: 'clock_resize', width: document.body.scrollWidth + 2, height: document.body.scrollHeight + 2 }, '*'), 150);
                    </script></body>`;
                    
                    if (/<\/body>/i.test(rawHtml)) {
                        iframeContent = rawHtml.replace(/<\/body>/i, injectJs);
                    } else {
                        iframeContent = rawHtml + injectJs.replace('</body>', '');
                    }
                } else {
                    iframeContent = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><style>html, body { margin: 0; padding: 0; overflow: hidden; background: transparent; color: ${state.clock.color}; font-family: ${state.clock.fontFamily}; display: inline-block; width: fit-content; height: fit-content; } #wrapper { display: inline-block; }</style></head><body><div id="wrapper">${rawHtml}</div><script>const wrapper = document.getElementById('wrapper'); const ro = new ResizeObserver(() => { window.parent.postMessage({ type: 'clock_resize', width: wrapper.scrollWidth + 2, height: wrapper.scrollHeight + 2 }, '*'); }); ro.observe(wrapper); setTimeout(() => { window.parent.postMessage({ type: 'clock_resize', width: wrapper.scrollWidth + 2, height: wrapper.scrollHeight + 2 }, '*'); }, 150);</script></body></html>`;
                }
                
                const blob = new Blob([iframeContent], { type: "text/html;charset=utf-8" });
                const blobUrl = URL.createObjectURL(blob);
                
                overlayClock.innerHTML = `<iframe id="clockIframe" src="${blobUrl}" style="border:none; width:100px; height:50px; background:transparent;" scrolling="no"></iframe>`;
            }
        } else {
            overlayClock.style.transform = "none";
            overlayClock.style.fontSize = `${state.clock.size}px`;
            delete overlayClock.dataset.customHtmlHash;

            overlayClock.innerHTML = `
                <div class="flex items-center gap-3">
                    <div id="clockLiveIndicator" class="flex items-center gap-1.5 text-red-500 hidden text-[10px] tracking-widest leading-none">
                        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>LIVE
                    </div>
                    <div id="clockTimer" class="leading-none">12:34:56</div>
                </div>
            `;
            const liveIndicator = document.getElementById("clockLiveIndicator");
            if (liveIndicator) {
                liveIndicator.style.display = state.clock.showLive ? 'flex' : 'none';
            }
        }

        overlayClock.style.top = "auto";
        overlayClock.style.bottom = "auto";
        overlayClock.style.left = "auto";
        overlayClock.style.right = "auto";

        const pad = state.frame.enabled ? state.frame.padding : 0;
        const m = pad + state.clock.margin;

        if (state.clock.pos === "top-left") {
            overlayClock.style.top = `${m}px`;
            overlayClock.style.left = `${m}px`;
        } else if (state.clock.pos === "top-right") {
            overlayClock.style.top = `${m}px`;
            overlayClock.style.right = `${m}px`;
        } else if (state.clock.pos === "bottom-left") {
            overlayClock.style.bottom = `${m}px`;
            overlayClock.style.left = `${m}px`;
        } else if (state.clock.pos === "bottom-right") {
            overlayClock.style.bottom = `${m}px`;
            overlayClock.style.right = `${m}px`;
        }
    } else {
        overlayClock.style.display = "none";
    }

    const overlayTicker = document.getElementById("overlayTicker");
    const oldTickerTrack = document.getElementById("tickerTrack");
    const tickerTrack = oldTickerTrack.cloneNode(true);
    oldTickerTrack.parentNode.replaceChild(tickerTrack, oldTickerTrack);

    if (state.ticker.enabled) {
        overlayTicker.style.display = "flex";
        
        if (state.ticker.bgEnabled) {
            overlayTicker.style.backgroundColor = `rgba(13, 13, 13, ${state.ticker.bgOpacity / 100})`;
            overlayTicker.style.borderTop = "1px solid rgba(255,255,255,0.1)";
            overlayTicker.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        } else {
            overlayTicker.style.backgroundColor = "transparent";
            overlayTicker.style.borderTop = "none";
            overlayTicker.style.borderBottom = "none";
        }

        const pad = state.frame.enabled ? state.frame.padding : 0;
        overlayTicker.style.top = "auto";
        overlayTicker.style.bottom = "auto";
        
        if (state.ticker.pos === "top") {
            overlayTicker.style.top = `${pad}px`;
        } else {
            overlayTicker.style.bottom = `${pad}px`;
        }
        
        overlayTicker.style.width = `calc(${state.ticker.width}% - ${pad * 2}px)`;

        if (state.frame.enabled && state.frame.radius > 0) {
            overlayTicker.style.borderRadius = `${state.frame.radius}px`;
        } else {
            overlayTicker.style.borderRadius = "0px";
        }

        let texts = [];
        if (state.ticker.text1.trim() !== "") texts.push(state.ticker.text1.trim());
        if (state.ticker.text2.trim() !== "") texts.push(state.ticker.text2.trim());
        if (state.ticker.text3.trim() !== "") texts.push(state.ticker.text3.trim());

        tickerTrack.style.fontSize = `${state.ticker.size}px`;
        tickerTrack.style.fontFamily = state.ticker.fontFamily;
        tickerTrack.style.color = state.ticker.color;
        
        if (texts.length > 0) {
            tickerTrack.textContent = texts[0];
            tickerTrack.style.animation = `scroll-left ${state.ticker.speed}s linear infinite`;
            
            if (texts.length > 1) {
                let currentIdx = 0;
                tickerTrack.addEventListener("animationiteration", () => {
                    currentIdx = (currentIdx + 1) % texts.length;
                    tickerTrack.textContent = texts[currentIdx];
                });
            }
        } else {
            tickerTrack.textContent = "";
            tickerTrack.style.animation = "none";
        }
    } else {
        overlayTicker.style.display = "none";
    }

    const overlayQr = document.getElementById("overlayQr");
    if (state.qr.enabled) {
        overlayQr.style.display = "block";
        overlayQr.style.width = `${state.qr.width}px`;
        
        let hasLabel = state.qr.list.some(q => q.url.trim() !== "" && q.label.trim() !== "");
        overlayQr.style.height = `${state.qr.width + (hasLabel ? 24 : 0)}px`;

        let borderC = state.qr.matchMain ? state.themeColor : "#333";
        let borderW = state.qr.matchMain && state.frame.enabled ? state.frame.width : 2;
        overlayQr.style.border = `${borderW}px solid ${borderC}`;

        if (state.qr.matchMain && state.useGradient) {
            overlayQr.style.borderImage = `linear-gradient(${state.gradientAngle}deg, ${state.themeColor}, ${state.themeColor2}) 1`;
        } else {
            overlayQr.style.borderImage = "none";
        }

        if (state.qr.matchMain && state.frame.enabled && state.frame.radius > 0) {
            overlayQr.style.borderRadius = `${state.frame.radius}px`;
            overlayQr.style.borderImage = "none";
        } else {
            overlayQr.style.borderRadius = "0px";
        }

        overlayQr.style.top = "auto";
        overlayQr.style.bottom = "auto";
        overlayQr.style.left = "auto";
        overlayQr.style.right = "auto";
        
        const pad = state.frame.enabled ? state.frame.padding : 0;
        const m = pad + state.qr.margin;
        
        if (state.qr.pos === "top-left") {
            overlayQr.style.top = `${m}px`;
            overlayQr.style.left = `${m}px`;
        } else if (state.qr.pos === "top-right") {
            overlayQr.style.top = `${m}px`;
            overlayQr.style.right = `${m}px`;
        } else if (state.qr.pos === "bottom-left") {
            overlayQr.style.bottom = `${m}px`;
            overlayQr.style.left = `${m}px`;
        } else if (state.qr.pos === "bottom-right") {
            overlayQr.style.bottom = `${m}px`;
            overlayQr.style.right = `${m}px`;
        }

        setupPreviewQr();
        startQrLoop();

    } else {
        overlayQr.style.display = "none";
        if (qrIntervalTimer) clearInterval(qrIntervalTimer);
    }
}

function getLogoSvg(type, color) {
    if (type === "x") return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
    if (type === "youtube") return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="${color}"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
    if (type === "twitch") return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="${color}"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>`;
    if (type === "instagram") return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;
    if (type === "tiktok") return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="${color}"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.43 5.92-1.54 1.48-3.66 2.24-5.83 2.15-2.31-.09-4.52-1.21-5.74-3.14-1.18-1.85-1.39-4.25-.66-6.31.75-2.11 2.53-3.79 4.71-4.32 2.17-.53 4.54-.15 6.43.91V6.52c-1.8-.82-3.83-1.1-5.81-.8-2.02.3-3.88 1.44-4.99 3.09-1.07 1.6-1.37 3.65-1.01 5.56.36 1.88 1.45 3.55 3.01 4.56 1.55 1.01 3.48 1.34 5.31 1.02 1.87-.33 3.51-1.45 4.52-3.05 1.03-1.62 1.36-3.63 1.14-5.55-.06-1.78-.01-3.55-.04-5.33-.03-2.12-.02-4.23-.03-6.35Z"/></svg>`;
    if (type === "discord") return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="${color}"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`;
    return "";
}

function setupPreviewQr() {
    const qrTrack = document.getElementById("qrTrack");
    if (!qrTrack) return;
    
    const validQrs = state.qr.list.filter(q => q.url.trim() !== "");
    if (validQrs.length === 0) {
        qrTrack.innerHTML = `<div class="w-full h-full shrink-0 flex flex-col items-center justify-center text-[10px] text-gray-400 bg-gray-100"><i data-lucide="qr-code" class="w-8 h-8 mb-1"></i>QR未設定</div>`;
        if (window.lucide) lucide.createIcons();
        return;
    }

    let html = "";
    let firstItemHtml = "";
    validQrs.forEach((q, i) => {
        const isGradient = q.color1 !== q.color2;
        const apiColor = isGradient ? "000000" : q.color1.replace('#', '');
        const src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(q.url)}&color=${apiColor}&format=svg`;
        
        let containerClass = "w-full h-full shrink-0 flex flex-col items-center justify-center bg-white p-2 box-border";
        let styleAttr = "";
        
        if (state.qr.anim === "fade") {
            containerClass = "absolute inset-0 flex flex-col items-center justify-center bg-white p-2 box-border transition-opacity duration-1000";
            styleAttr = `style="opacity: ${i === 0 ? '1' : '0'};"`;
        }
        
        const logoHtml = q.logo !== "none" ? `
            <div class="absolute" style="top: 50%; left: 50%; transform: translate(-50%, -50%); width: 25%; height: 25%; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 4px; border: 2px solid white;">
                ${getLogoSvg(q.logo, q.color1)}
            </div>
        ` : '';

        let qrImgHtml = '';
        if (isGradient) {
            qrImgHtml = `
            <div class="relative flex-1 w-full min-h-0 flex items-center justify-center" style="background: linear-gradient(135deg, ${q.color1}, ${q.color2});">
                <img src="${src}" class="w-full h-full object-contain mix-blend-screen" />
                ${logoHtml}
            </div>`;
        } else {
            qrImgHtml = `
            <div class="relative flex-1 w-full min-h-0 flex items-center justify-center bg-white">
                <img src="${src}" class="w-full h-full object-contain" />
                ${logoHtml}
            </div>`;
        }

        const itemHtml = `
        <div class="${containerClass}" ${styleAttr}>
            ${qrImgHtml}
            ${q.label.trim() ? `<div class="text-[11px] font-bold text-black mt-1 truncate w-full text-center" style="color: ${q.color1}">${q.label}</div>` : ''}
        </div>`;
        html += itemHtml;
        if (i === 0) firstItemHtml = itemHtml;
    });
    if (state.qr.anim === "slide" && validQrs.length > 1) {
        html += firstItemHtml;
    }
    qrTrack.innerHTML = html;
    
    currentQrIdx = 0;

    if (state.qr.anim === "fade") {
        qrTrack.className = "w-full h-full relative";
        qrTrack.style.transform = "none";
    } else {
        qrTrack.className = "flex w-full h-full";
        qrTrack.style.transform = "translateX(0%)";
    }
}

function startQrLoop() {
    if (qrIntervalTimer) clearInterval(qrIntervalTimer);
    
    const validQrs = state.qr.list.filter(q => q.url.trim() !== "");
    if (!state.qr.enabled || validQrs.length <= 1) return;

    qrIntervalTimer = setInterval(() => {
        const qrTrack = document.getElementById("qrTrack");
        if (!qrTrack) return;

        if (state.qr.anim === "fade") {
            currentQrIdx = (currentQrIdx + 1) % validQrs.length;
            Array.from(qrTrack.children).forEach((child, i) => {
                child.style.opacity = i === currentQrIdx ? "1" : "0";
            });
        } else if (state.qr.anim === "slide") {
            currentQrIdx++;
            qrTrack.style.transition = "transform 0.7s ease-in-out";
            qrTrack.style.transform = `translateX(-${currentQrIdx * 100}%)`;
            
            if (currentQrIdx === validQrs.length) {
                setTimeout(() => {
                    qrTrack.style.transition = "none";
                    currentQrIdx = 0;
                    qrTrack.style.transform = "translateX(0%)";
                }, 700);
            }
        } else {
            qrTrack.appendChild(qrTrack.firstElementChild);
        }
    }, Math.max(state.qr.interval * 1000, 2000));
}

window.onload = () => {
    const inputs = [
        "resWidth", "resHeight", "themeColor", "useGradient", "themeColor2", "gradientAngle",
        "frameEnabled", "frameStyle", "frameWidth", "frameRadius", "framePadding", "frameAnim",
        "channelEnabled", "channelText", "channelFont", "channelSize", "channelColor", "channelOffsetX", "channelOffsetY",
        "snsEnabled", "snsPos", "snsMargin", "snsFont", "snsSize", "snsColor", "snsPadding",
        "snsUseX", "snsValX", "snsUseYT", "snsValYT", "snsUseTwitch", "snsValTwitch",
        "snsUseIG", "snsValIG", "snsUseTikTok", "snsValTikTok", "snsUseCustom", "snsValCustom",
        "wipeEnabled", "wipePos", "wipeAspect", "wipeWidth", "wipeMargin", "wipeTextTop", "wipeTextBottom", "wipeTextSize", "wipeFont", "wipeColor", "wipeMatchMain",
        "clockEnabled", "clockPos", "clockSize", "clockMargin", "clockShowLive", "clockHTML", "clockFont", "clockColor",
        "tickerEnabled", "tickerText1", "tickerText2", "tickerText3", "tickerBgEnabled", "tickerPos", "tickerWidth", "tickerBgOpacity", "tickerSpeed", "tickerFont", "tickerSize", "tickerColor",
        "qrEnabled", "qrPos", "qrWidth", "qrMargin", "qrMatchMain", "qrInterval", "qrAnim",
        "qrUrl1", "qrLabel1", "qrColor1_1", "qrColor1_2", "qrLogo1",
        "qrUrl2", "qrLabel2", "qrColor2_1", "qrColor2_2", "qrLogo2",
        "qrUrl3", "qrLabel3", "qrColor3_1", "qrColor3_2", "qrLogo3"
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", updateFromInputs);
            el.addEventListener("change", updateFromInputs);
        }
    });

    document.getElementById("globalFont").addEventListener("change", (e) => {
        const newFont = e.target.value;
        ["channelFont", "snsFont", "wipeFont", "clockFont", "tickerFont"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = newFont;
        });
        updateFromInputs();
    });

    document.getElementById("themeColorText").addEventListener("input", (e) => {
        let color = e.target.value;
        if (color.startsWith("#") && color.length === 7) {
            document.getElementById("themeColor").value = color;
            updateFromInputs();
        }
    });

    document.getElementById("themeColor2Text").addEventListener("input", (e) => {
        let color = e.target.value;
        if (color.startsWith("#") && color.length === 7) {
            document.getElementById("themeColor2").value = color;
            updateFromInputs();
        }
    });

    document.getElementById("btnExportHTML").addEventListener("click", exportHTML);

    updateFromInputs();
};

function setResolutionPreset(w, h) {
    document.getElementById("resWidth").value = w;
    document.getElementById("resHeight").value = h;
    updateFromInputs();
}

function showToast() {
    const toast = document.getElementById("toastNotification");
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
    setTimeout(() => {
        toast.style.transform = "translateY(20px)";
        toast.style.opacity = "0";
    }, 3000);
}

function exportHTML() {
    let svgDefs = `<defs>`;
    let mainColorAttr = `stroke="${state.themeColor}"`;
    if (state.useGradient) {
        svgDefs += getGradientDef("mainGrad", state.themeColor, state.themeColor2, state.gradientAngle);
        mainColorAttr = `stroke="url(#mainGrad)"`;
    }
    svgDefs += `
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>`;

    let svgContent = svgDefs;
    if (state.frame.enabled) {
        const p = state.frame.padding;
        const w = state.width - (p * 2);
        const h = state.height - (p * 2);
        const r = state.frame.radius;
        const fw = state.frame.width;
        
        let styleStr = "";
        if (state.frame.anim === "pulse") styleStr = `animation: pulse-anim 2s infinite;`;
        else if (state.frame.anim === "flow") styleStr = `stroke-dasharray: 100 20; animation: march-border 2s linear infinite;`;

        if (state.frame.style === "simple") {
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" ${mainColorAttr} stroke-width="${fw}" style="${styleStr}"></rect>`;
        } else if (state.frame.style === "double") {
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" ${mainColorAttr} stroke-width="${fw}" style="${styleStr}"></rect>`;
            svgContent += `<rect x="${p + fw + 4}" y="${p + fw + 4}" width="${w - (fw*2) - 8}" height="${h - (fw*2) - 8}" rx="${Math.max(0, r-4)}" ry="${Math.max(0, r-4)}" fill="none" ${mainColorAttr} stroke-width="${fw/2}" opacity="0.6" style="${styleStr}"></rect>`;
        } else if (state.frame.style === "neon") {
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" ${mainColorAttr} stroke-width="${fw}" filter="url(#neonGlow)" style="${styleStr}"></rect>`;
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" stroke="#fff" stroke-width="${fw/2}"></rect>`;
        } else if (state.frame.style === "dashed") {
            svgContent += `<rect x="${p}" y="${p}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="none" ${mainColorAttr} stroke-width="${fw}" stroke-dasharray="${fw*3} ${fw*3}" style="${styleStr}"></rect>`;
        } else if (state.frame.style === "corners") {
            const cl = 60; 
            const d = `M ${p},${p+cl} L ${p},${p} L ${p+cl},${p} M ${p+w-cl},${p} L ${p+w},${p} L ${p+w},${p+cl} M ${p+w},${p+h-cl} L ${p+w},${p+h} L ${p+w-cl},${p+h} M ${p+cl},${p+h} L ${p},${p+h} L ${p},${p+h-cl}`;
            svgContent += `<path d="${d}" fill="none" ${mainColorAttr} stroke-width="${fw}" stroke-linejoin="round" style="${styleStr}"></path>`;
        } else if (state.frame.style === "brackets") {
            const cl = 100;
            const d = `M ${p+cl},${p} L ${p},${p} L ${p},${p+h} L ${p+cl},${p+h} M ${p+w-cl},${p} L ${p+w},${p} L ${p+w},${p+h} L ${p+w-cl},${p+h}`;
            svgContent += `<path d="${d}" fill="none" ${mainColorAttr} stroke-width="${fw}" stroke-linejoin="round" style="${styleStr}"></path>`;
        } else if (state.frame.style === "cinema") {
            svgContent += `<rect x="0" y="0" width="${state.width}" height="${state.height*0.1}" fill="#000"></rect>`;
            svgContent += `<rect x="0" y="${state.height*0.9}" width="${state.width}" height="${state.height*0.1}" fill="#000"></rect>`;
            svgContent += `<line x1="0" y1="${state.height*0.1}" x2="${state.width}" y2="${state.height*0.1}" ${mainColorAttr} stroke-width="${fw}" style="${styleStr}"></line>`;
            svgContent += `<line x1="0" y1="${state.height*0.9}" x2="${state.width}" y2="${state.height*0.9}" ${mainColorAttr} stroke-width="${fw}" style="${styleStr}"></line>`;
        }
    }

    const pad = state.frame.enabled ? state.frame.padding : 0;
    let channelPosStyle = "";
    if (state.channel.pos === "top") {
        channelPosStyle = `top: ${pad + state.channel.offsetY}px; left: ${state.channel.offsetX}%; transform: translateX(-50%);`;
    } else if (state.channel.pos === "bottom") {
        channelPosStyle = `bottom: ${pad + state.channel.offsetY}px; left: ${state.channel.offsetX}%; transform: translateX(-50%);`;
    } else if (state.channel.pos === "center") {
        channelPosStyle = `top: calc(50% + ${state.channel.offsetY}px); left: ${state.channel.offsetX}%; transform: translate(-50%, -50%);`;
    }

    let snsPosStyle = "";
    let snsFlexDir = "row";
    const snsM = pad + state.sns.margin;
    if (state.sns.pos === "top") {
        snsPosStyle = `top: ${snsM}px; left: 50%; transform: translateX(-50%);`;
    } else if (state.sns.pos === "bottom") {
        snsPosStyle = `bottom: ${snsM}px; left: 50%; transform: translateX(-50%);`;
    } else if (state.sns.pos === "left") {
        snsPosStyle = `left: ${snsM}px; top: 50%; transform: translateY(-50%);`;
        snsFlexDir = "column";
    } else if (state.sns.pos === "right") {
        snsPosStyle = `right: ${snsM}px; top: 50%; transform: translateY(-50%);`;
        snsFlexDir = "column";
    }

    const sIcons = {
        X: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        YT: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
        Twitch: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>`,
        IG: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
        TikTok: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-.9 4.45-2.43 5.92-1.54 1.48-3.66 2.24-5.83 2.15-2.31-.09-4.52-1.21-5.74-3.14-1.18-1.85-1.39-4.25-.66-6.31.75-2.11 2.53-3.79 4.71-4.32 2.17-.53 4.54-.15 6.43.91V6.52c-1.8-.82-3.83-1.1-5.81-.8-2.02.3-3.88 1.44-4.99 3.09-1.07 1.6-1.37 3.65-1.01 5.56.36 1.88 1.45 3.55 3.01 4.56 1.55 1.01 3.48 1.34 5.31 1.02 1.87-.33 3.51-1.45 4.52-3.05 1.03-1.62 1.36-3.63 1.14-5.55-.06-1.78-.01-3.55-.04-5.33-.03-2.12-.02-4.23-.03-6.35Z"/></svg>`,
        Custom: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
    };
    let snsHtml = "";
    const keys = ["X", "YT", "Twitch", "IG", "TikTok", "Custom"];
    keys.forEach(k => {
        if (state.sns.list[k].enabled && state.sns.list[k].val) {
            snsHtml += `<div style="display: flex; align-items: center; gap: 8px;">${sIcons[k]}<span>${state.sns.list[k].val}</span></div>`;
        }
    });

    function getWipePositionStyle() {
        const m = pad + state.wipe.margin;
        if (state.wipe.pos === "top-left") return `top: ${m}px; left: ${m}px;`;
        if (state.wipe.pos === "top-right") return `top: ${m}px; right: ${m}px;`;
        if (state.wipe.pos === "bottom-left") return `bottom: ${m}px; left: ${m}px;`;
        if (state.wipe.pos === "bottom-right") return `bottom: ${m}px; right: ${m}px;`;
    }

    let wipeAspectR = 16/9;
    if (state.wipe.aspect === "4-3") wipeAspectR = 4/3;
    else if (state.wipe.aspect === "1-1") wipeAspectR = 1;
    const wipeHeight = state.wipe.width / wipeAspectR;
    
    let wipeBorderC = state.wipe.matchMain ? state.themeColor : state.wipe.color;
    let wipeBorderW = state.wipe.matchMain && state.frame.enabled ? state.frame.width : 2;
    let wipeBorderRadius = state.wipe.matchMain && state.frame.enabled && state.frame.radius > 0 ? state.frame.radius : 0;
    
    let wipeBorderImg = "none";
    if (state.wipe.matchMain && state.useGradient && wipeBorderRadius === 0) {
        wipeBorderImg = `linear-gradient(${state.gradientAngle}deg, ${state.themeColor}, ${state.themeColor2}) 1`;
    }

    function getClockPositionStyle() {
        const m = pad + state.clock.margin;
        if (state.clock.pos === "top-left") return `top: ${m}px; left: ${m}px;`;
        if (state.clock.pos === "top-right") return `top: ${m}px; right: ${m}px;`;
        if (state.clock.pos === "bottom-left") return `bottom: ${m}px; left: ${m}px;`;
        if (state.clock.pos === "bottom-right") return `bottom: ${m}px; right: ${m}px;`;
    }

    let clockBodyHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            ${state.clock.showLive ? `<div style="display: flex; align-items: center; gap: 6px; color: #ef4444; font-size: 0.35em; letter-spacing: 0.1em;"><span style="width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%; display: inline-block; animation: custom-pulse 2s infinite;"></span>LIVE</div>` : ''}
            <div id="clockTimer" style="line-height: 1;">00:00:00</div>
        </div>
    `;
    let clockScript = `
        function startClock() {
            setInterval(() => {
                const now = new Date();
                const h = String(now.getHours()).padStart(2, '0');
                const m = String(now.getMinutes()).padStart(2, '0');
                const s = String(now.getSeconds()).padStart(2, '0');
                const el = document.getElementById('clockTimer');
                if(el) el.textContent = h + ':' + m + ':' + s;
            }, 1000);
        }
        startClock();
    `;

    if (state.clock.customHTML.trim() !== "") {
        let rawHtml = state.clock.customHTML;
        let iframeContent = "";

        if (rawHtml.toLowerCase().includes("<html")) {
            const injectCss = `<style>html, body { margin: 0 !important; padding: 0 !important; width: fit-content !important; height: fit-content !important; background: transparent !important; overflow: hidden !important; }</style></head>`;
            if (/<\/head>/i.test(rawHtml)) {
                rawHtml = rawHtml.replace(/<\/head>/i, injectCss);
            } else {
                rawHtml = rawHtml.replace(/<html[^>]*>/i, `$&<head>${injectCss}`);
            }
            
            const injectJs = `<script>
                const ro = new ResizeObserver(() => { 
                    window.parent.postMessage({ type: 'clock_resize', width: document.body.scrollWidth + 2, height: document.body.scrollHeight + 2 }, '*'); 
                }); 
                ro.observe(document.body);
            </script></body>`;
            
            if (/<\/body>/i.test(rawHtml)) {
                iframeContent = rawHtml.replace(/<\/body>/i, injectJs);
            } else {
                iframeContent = rawHtml + injectJs.replace('</body>', '');
            }
        } else {
            iframeContent = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><style>html, body { margin: 0; padding: 0; overflow: hidden; background: transparent; color: ${state.clock.color}; font-family: ${state.clock.fontFamily}; display: inline-block; width: fit-content; height: fit-content; } #wrapper { display: inline-block; }</style></head><body><div id="wrapper">${rawHtml}</div><script>const wrapper = document.getElementById('wrapper'); const ro = new ResizeObserver(() => { window.parent.postMessage({ type: 'clock_resize', width: wrapper.scrollWidth + 2, height: wrapper.scrollHeight + 2 }, '*'); }); ro.observe(wrapper);</script></body></html>`;
        }
        
        const escapedHtml = iframeContent.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        clockBodyHTML = `<iframe id="clockIframe" srcdoc="${escapedHtml}" style="border:none; width:100px; height:50px; background:transparent;" scrolling="no"></iframe>`;
        
        clockScript = `
            window.addEventListener('message', (e) => {
                if (e.data && e.data.type === 'clock_resize') {
                    const iframe = document.getElementById('clockIframe');
                    if (iframe) {
                        iframe.style.width = e.data.width + 'px';
                        iframe.style.height = e.data.height + 'px';
                    }
                }
            });
        `;
    }

    let tickerTexts = [];
    if (state.ticker.text1.trim() !== "") tickerTexts.push(state.ticker.text1.trim());
    if (state.ticker.text2.trim() !== "") tickerTexts.push(state.ticker.text2.trim());
    if (state.ticker.text3.trim() !== "") tickerTexts.push(state.ticker.text3.trim());
    const initialTickerText = tickerTexts.length > 0 ? tickerTexts[0] : "";

    function getTickerPositionStyle() {
        if (state.ticker.pos === "top") return `top: ${pad}px; border-bottom: 1px solid rgba(255,255,255,0.1);`;
        return `bottom: ${pad}px; border-top: 1px solid rgba(255,255,255,0.1);`;
    }

    function getQrPositionStyle() {
        const m = pad + state.qr.margin;
        if (state.qr.pos === "top-left") return `top: ${m}px; left: ${m}px;`;
        if (state.qr.pos === "top-right") return `top: ${m}px; right: ${m}px;`;
        if (state.qr.pos === "bottom-left") return `bottom: ${m}px; left: ${m}px;`;
        if (state.qr.pos === "bottom-right") return `bottom: ${m}px; right: ${m}px;`;
    }

    let qrBorderC = state.qr.matchMain ? state.themeColor : "#333";
    let qrBorderW = state.qr.matchMain && state.frame.enabled ? state.frame.width : 2;
    let qrBorderRadius = state.qr.matchMain && state.frame.enabled && state.frame.radius > 0 ? state.frame.radius : 0;
    
    let qrBorderImg = "none";
    if (state.qr.matchMain && state.useGradient && qrBorderRadius === 0) {
        qrBorderImg = `linear-gradient(${state.gradientAngle}deg, ${state.themeColor}, ${state.themeColor2}) 1`;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OBS Overlay Screen Layer</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@400;500;700&family=Inter:wght@400;700&family=Kosugi&family=M+PLUS+1p:wght@400;700&family=Noto+Sans+JP:wght@400;700&family=Orbitron:wght@500;800&family=Roboto:wght@400;700&display=swap');
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            width: ${state.width}px;
            height: ${state.height}px;
            overflow: hidden;
            background-color: transparent;
            position: relative;
        }

        @keyframes pulse-anim {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }

        @keyframes march-border {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -100; }
        }
        
        @keyframes custom-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
        }

        #svgLayer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        }

        #channelArea {
            display: ${state.channel.enabled && state.channel.text.trim() !== "" ? 'block' : 'none'};
            position: absolute;
            font-family: ${state.channel.fontFamily};
            font-size: ${state.channel.size}px;
            color: ${state.channel.color};
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
            z-index: 20;
            ${channelPosStyle}
        }

        #snsArea {
            display: ${state.sns.enabled ? 'flex' : 'none'};
            position: absolute;
            background-color: rgba(13, 13, 13, 0.7);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: ${state.sns.padding}px ${state.sns.padding * 2}px;
            border-radius: 16px;
            font-size: ${state.sns.size}px;
            font-family: ${state.sns.fontFamily};
            color: ${state.sns.color};
            flex-direction: ${snsFlexDir};
            gap: 24px;
            font-weight: 500;
            z-index: 20;
            ${snsPosStyle}
        }

        #wipeArea {
            display: ${state.wipe.enabled ? 'block' : 'none'};
            position: absolute;
            width: ${state.wipe.width}px;
            height: ${wipeHeight}px;
            background-color: transparent;
            border: ${wipeBorderW}px solid ${wipeBorderC};
            border-image: ${wipeBorderImg};
            border-radius: ${wipeBorderRadius}px;
            overflow: hidden;
            z-index: 15;
            ${getWipePositionStyle()}
        }

        .wipe-banner {
            position: absolute;
            left: 0;
            width: 100%;
            background-color: rgba(13, 13, 13, 0.8);
            text-align: center;
            font-weight: bold;
            padding: 4px 8px;
            font-family: ${state.wipe.fontFamily};
            font-size: ${state.wipe.textSize}px;
            color: ${state.wipe.color};
        }

        #clockArea {
            display: ${state.clock.enabled ? 'block' : 'none'};
            position: absolute;
            font-family: ${state.clock.fontFamily};
            font-weight: bold;
            color: ${state.clock.color};
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
            z-index: 20;
            ${getClockPositionStyle()}
            transform-origin: ${state.clock.pos === 'top-left' ? 'top left' : state.clock.pos === 'top-right' ? 'top right' : state.clock.pos === 'bottom-left' ? 'bottom left' : 'bottom right'};
            ${state.clock.customHTML.trim() !== "" ? `transform: scale(${state.clock.size / 32});` : `font-size: ${state.clock.size}px;`}
        }

        #tickerArea {
            display: ${state.ticker.enabled ? 'flex' : 'none'};
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: ${state.ticker.width}%;
            height: 48px;
            align-items: center;
            background-color: ${state.ticker.bgEnabled ? `rgba(13, 13, 13, ${state.ticker.bgOpacity / 100})` : 'transparent'};
            border-radius: ${state.frame.enabled && state.frame.radius > 0 ? state.frame.radius : 0}px;
            overflow: hidden;
            z-index: 15;
            ${getTickerPositionStyle()}
        }

        #tickerTrack {
            white-space: nowrap;
            padding-left: 100%;
            font-family: ${state.ticker.fontFamily};
            font-size: ${state.ticker.size}px;
            color: ${state.ticker.color};
            animation: scroll-left ${state.ticker.speed}s linear infinite;
        }

        @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }

        #qrBorder {
            display: ${state.qr.enabled ? 'block' : 'none'};
            position: absolute;
            width: ${state.qr.width}px;
            border: ${qrBorderW}px solid ${qrBorderC};
            border-image: ${qrBorderImg};
            border-radius: ${qrBorderRadius}px;
            overflow: hidden;
            background-color: #ffffff;
            z-index: 15;
            ${getQrPositionStyle()}
        }
        
        #qrTrack {
            width: 100%;
            height: 100%;
        }
        
        .qr-label {
            font-size: 11px;
            font-weight: bold;
            text-align: center;
            margin-top: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        }
        
        .qr-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 8px;
            box-sizing: border-box;
            background-color: #ffffff;
        }

    </style>
</head>
<body>
    <svg id="svgLayer" xmlns="http://www.w3.org/2000/svg">
        ${svgContent}
    </svg>

    <div id="channelArea">${state.channel.text}</div>

    <div id="snsArea">
        ${snsHtml}
    </div>

    <div id="wipeArea">
        <div id="wipeTopBanner" class="wipe-banner" style="top: 0; display: ${state.wipe.textTop.trim() !== '' ? 'block' : 'none'};">${state.wipe.textTop}</div>
        <div id="wipeBottomBanner" class="wipe-banner" style="bottom: 0; display: ${state.wipe.textBottom.trim() !== '' ? 'block' : 'none'};">${state.wipe.textBottom}</div>
    </div>

    <div id="clockArea">
        ${clockBodyHTML}
    </div>

    <div id="tickerArea">
        <div id="tickerTrack">${initialTickerText}</div>
    </div>

    <div id="qrBorder">
        <div id="qrTrack"></div>
    </div>

    <script>
        ${clockScript}
        ${getLogoSvg.toString()}

        const tickerTexts = ${JSON.stringify(tickerTexts)};
        const expTickerTrack = document.getElementById("tickerTrack");
        if (expTickerTrack && tickerTexts.length > 1) {
            let tickerIdx = 0;
            expTickerTrack.addEventListener("animationiteration", () => {
                tickerIdx = (tickerIdx + 1) % tickerTexts.length;
                expTickerTrack.textContent = tickerTexts[tickerIdx];
            });
        }

        const qrState = ${JSON.stringify(state.qr)};
        const qrList = qrState.list.filter(q => q.url.trim() !== "");
        const qrTrack = document.getElementById("qrTrack");
        const qrBorder = document.getElementById("qrBorder");
        
        if (qrState.enabled && qrList.length > 0) {
            let html = "";
            let hasLabel = false;
            let firstItemHtml = "";
            
            qrList.forEach((q, i) => {
                const isGrad = q.color1 !== q.color2;
                const apiColor = isGrad ? "000000" : q.color1.replace('#', '');
                const src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(q.url) + '&color=' + apiColor + '&format=svg';
                const labelHtml = q.label.trim() ? '<div class="qr-label" style="color: ' + q.color1 + '">' + q.label + '</div>' : '';
                if (q.label.trim()) hasLabel = true;
                
                let logoHtml = "";
                if (q.logo !== "none") {
                    logoHtml = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 25%; height: 25%; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 4px; border: 2px solid white;">' + getLogoSvg(q.logo, q.color1) + '</div>';
                }

                let qrImgHtml = "";
                if (isGrad) {
                    qrImgHtml = '<div style="position: relative; flex: 1; width: 100%; min-height: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, ' + q.color1 + ', ' + q.color2 + ');">' +
                        '<img src="' + src + '" style="width: 100%; height: 100%; object-fit: contain; mix-blend-mode: screen;" />' + logoHtml + '</div>';
                } else {
                    qrImgHtml = '<div style="position: relative; flex: 1; width: 100%; min-height: 0; display: flex; align-items: center; justify-content: center; background: white;">' +
                        '<img src="' + src + '" style="width: 100%; height: 100%; object-fit: contain;" />' + logoHtml + '</div>';
                }

                let itemHtml = "";
                if (qrState.anim === "fade") {
                    itemHtml = '<div class="qr-item" style="position: absolute; inset: 0; transition: opacity 1s; opacity: ' + (i === 0 ? 1 : 0) + '">' + qrImgHtml + labelHtml + '</div>';
                } else {
                    itemHtml = '<div class="qr-item" style="flex-shrink: 0; width: 100%; height: 100%;">' + qrImgHtml + labelHtml + '</div>';
                }
                html += itemHtml;
                if (i === 0) firstItemHtml = itemHtml;
            });
            if (qrState.anim === "slide" && qrList.length > 1) {
                html += firstItemHtml;
            }
            
            qrTrack.innerHTML = html;
            qrBorder.style.height = (qrState.width + (hasLabel ? 24 : 0)) + "px";

            if (qrState.anim === "fade") {
                qrTrack.style.position = "relative";
            } else {
                qrTrack.style.display = "flex";
            }

            if (qrList.length > 1) {
                let currentQr = 0;
                setInterval(() => {
                    if (qrState.anim === "fade") {
                        currentQr = (currentQr + 1) % qrList.length;
                        Array.from(qrTrack.children).forEach((child, i) => {
                            child.style.opacity = i === currentQr ? "1" : "0";
                        });
                    } else if (qrState.anim === "slide") {
                        currentQr++;
                        qrTrack.style.transition = "transform 0.7s ease-in-out";
                        qrTrack.style.transform = 'translateX(-' + (currentQr * 100) + '%)';
                        if (currentQr === qrList.length) {
                            setTimeout(() => {
                                qrTrack.style.transition = "none";
                                currentQr = 0;
                                qrTrack.style.transform = 'translateX(0)';
                            }, 700);
                        }
                    } else {
                        qrTrack.appendChild(qrTrack.firstElementChild);
                    }
                }, Math.max(qrState.interval * 1000, 2000));
            }
        }
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "obs_overlay.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast();
}
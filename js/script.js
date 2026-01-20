const perfil = configuracao.perfil;
const caminhoMidia = "midia/";

// === INICIALIZAÇÃO ===
document.getElementById('top-username').innerText = perfil.usuario;
document.getElementById('profile-img').src = caminhoMidia + perfil.fotoPerfil;
document.getElementById('zoomed-img').src = caminhoMidia + perfil.fotoPerfil;
document.getElementById('posts-count').innerText = configuracao.totalFotos;
document.getElementById('followers-count').innerText = perfil.seguidores;
document.getElementById('following-count').innerText = perfil.seguindo;
document.getElementById('bio-name').innerText = perfil.nome;
document.getElementById('bio-text').innerHTML = perfil.bio;
document.getElementById('bio-link').innerText = perfil.link;
document.getElementById('bio-link').href = "https://" + perfil.link;

// === CARREGAR DESTAQUES (CORRIGIDO: CAPA = PRIMEIRA FOTO) ===
const highlightsContainer = document.getElementById('highlights-container');

if (configuracao.destaques && configuracao.destaques.length > 0) {
    const htmlDestaques = configuracao.destaques.map((destaque, index) => {
        let capaArquivo = "";
        
        // Pega sempre a primeira mídia da lista
        if (destaque.fotos && destaque.fotos.length > 0) {
            let primeiraMidia = destaque.fotos[0];

            // Verifica se é texto (arquivo direto) ou objeto (foto+som)
            if (typeof primeiraMidia === 'string') {
                capaArquivo = primeiraMidia;
            } else {
                capaArquivo = primeiraMidia.arquivo;
            }
        } else {
            // Se a lista estiver vazia, usa um placeholder
            capaArquivo = "placeholder.png"; 
        }

        return `
        <div class="highlight-item" onclick="abrirStory(${index})">
            <div class="circle">
                <img src="${caminhoMidia}${capaArquivo}" onerror="this.src='https://via.placeholder.com/60/111/fff?text=Stories'">
            </div>
            <span class="h-name">${destaque.titulo}</span>
        </div>`;
    }).join('');

    highlightsContainer.innerHTML = htmlDestaques;
} else {
    highlightsContainer.style.display = 'none';
}

// === GERAR POSTS ===
let listaPosts = [];
for (let i = configuracao.totalFotos; i >= 1; i--) {
    let dadosExtra = configuracao.postsEspecificos.find(p => p.id === i);
    
    let dataPadrao = "2026";
    if (i === configuracao.totalFotos) dataPadrao = "RECENTEMENTE";

    let post = {
        id: i,
        tipo: dadosExtra?.tipo || "foto",
        legenda: dadosExtra?.legenda || configuracao.frases[Math.floor(Math.random() * configuracao.frases.length)],
        likes: dadosExtra?.likes || Math.floor(Math.random() * 1000) + 50,
        data: dadosExtra?.data || dataPadrao,
        audio: dadosExtra?.audio || null,
        arquivosCarrossel: dadosExtra?.arquivos || []
    };

    if (post.tipo === 'carrossel' && post.arquivosCarrossel.length > 0) post.arquivo = post.arquivosCarrossel[0];
    else if (post.tipo === 'video') post.arquivo = `${i}.mp4`;
    else post.arquivo = `${i}.png`;

    listaPosts.push(post);
}

renderizarGrid(listaPosts);
renderizarFeed(listaPosts);

// === FUNÇÕES DE RENDERIZAÇÃO ===

function renderizarGrid(lista) {
    const grid = document.getElementById('grid-container');
    const htmlGrid = lista.map((post) => {
        let conteudo = "";
        let icone = "";

        if (post.tipo === 'carrossel') icone = '❐';
        else if (post.audio) icone = '🎵';
        else if (post.tipo === 'video') icone = '▶';

        if (post.tipo === 'video') {
            conteudo = `<video src="${caminhoMidia}${post.arquivo}#t=0.1" preload="metadata" muted></video>`;
        } else {
            conteudo = `<img src="${caminhoMidia}${post.arquivo}" loading="lazy">`;
        }

        let iconeHtml = icone ? `<div class="type-icon">${icone}</div>` : '';
        return `<div class="grid-item" onclick="abrirFeed(${post.id})">${conteudo}${iconeHtml}</div>`;
    }).join('');
    grid.innerHTML = htmlGrid;
}

function renderizarFeed(lista) {
    const feed = document.getElementById('feed-container');
    const htmlFeed = lista.map((post) => {
        let midiaHTML = "";
        
        if (post.tipo === 'video') {
            midiaHTML = `<video controls playsinline preload="metadata"><source src="${caminhoMidia}${post.arquivo}" type="video/mp4"></video>`;
        } else if (post.tipo === 'carrossel') {
            let slides = post.arquivosCarrossel.map((arq, i) => `<img src="${caminhoMidia}${arq}" class="carousel-slide ${i===0?'active':''}" data-index="${i}" onclick="abrirZoom(this.src)" loading="lazy">`).join('');
            let dots = post.arquivosCarrossel.map((_, i) => `<span class="dot ${i===0?'active':''}"></span>`).join('');
            midiaHTML = `<div class="carousel-wrapper" id="carousel-${post.id}">${slides}<div class="nav-arrow left" onclick="mudarSlide(${post.id}, -1)">❮</div><div class="nav-arrow right" onclick="mudarSlide(${post.id}, 1)">❯</div><div class="carousel-dots">${dots}</div></div>`;
        } else {
            midiaHTML = `<img src="${caminhoMidia}${post.arquivo}" onclick="abrirZoom(this.src)" loading="lazy">`;
        }

        let audioHTML = post.audio ? `<div class="audio-btn" onclick="toggleAudio('audio-player-${post.id}', this)">🔇</div><audio id="audio-player-${post.id}" src="${caminhoMidia}${post.audio}"></audio>` : "";
        const shareIconSVG = `<svg class="share-icon" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;

        return `
            <div class="post" id="post-${post.id}">
                <div class="post-header"><img class="post-avatar" src="${caminhoMidia}${perfil.fotoPerfil}"><span>${perfil.usuario}</span></div>
                <div class="post-media">${midiaHTML}${audioHTML}</div>
                <div class="post-actions">
                    <div class="icon" onclick="curtir(this, 'likes-${post.id}')">♡</div>
                    <div class="icon" onclick="abrirOffline()">💬</div>
                    <div class="icon" onclick="compartilhar(this, ${post.id})">${shareIconSVG}</div>
                </div>
                <div class="post-details">
                    <span class="likes-bold" id="likes-${post.id}">${post.likes} likes</span>
                    <div class="caption"><span>${perfil.usuario}</span> ${post.legenda}</div>
                    <span class="date">${post.data}</span>
                </div>
            </div>`;
    }).join('');
    feed.innerHTML = htmlFeed;
}

// === INTERAÇÕES ===
function fecharOffline() { 
    document.getElementById('offline-view').classList.add('hidden');
    document.getElementById('feed-view').classList.add('hidden');
    document.getElementById('profile-view').classList.remove('hidden');
    window.scrollTo(0,0);
}
function abrirOffline() { document.getElementById('offline-view').classList.remove('hidden'); }

function mudarAba(tipo, tabElement) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tabElement.classList.add('active');
    if (tipo === 'todos') renderizarGrid(listaPosts);
    else if (tipo === 'videos') renderizarGrid(listaPosts.filter(p => p.tipo === 'video'));
}

let seguindo = false;
function seguir() {
    const btn = document.getElementById('btn-follow');
    const count = document.getElementById('followers-count');
    let num = parseInt(configuracao.perfil.seguidores);
    if (!seguindo) { seguindo = true; btn.innerText = "Following"; btn.classList.add("following"); count.innerText = num + 1; } 
    else { seguindo = false; btn.innerText = "Follow"; btn.classList.remove("following"); count.innerText = num; }
}

function curtir(btn, idContador) {
    const contador = document.getElementById(idContador);
    let numeroAtual = parseInt(contador.innerText.split(' ')[0]);
    if (btn.innerText === "♡") { btn.innerText = "♥"; btn.classList.add("liked"); numeroAtual++; } 
    else { btn.innerText = "♡"; btn.classList.remove("liked"); numeroAtual--; }
    contador.innerText = `${numeroAtual} likes`;
}

function compartilhar(btn, idPost) {
    const link = window.location.href.split('#')[0] + "#post-" + idPost;
    navigator.clipboard.writeText(link).then(() => {
        const svg = btn.querySelector('svg');
        svg.classList.add('copied');
        setTimeout(() => svg.classList.remove('copied'), 500);
    });
}

function abrirZoom(src) { const modal = document.getElementById('profile-zoom-view'); document.getElementById('zoomed-img').src = src; modal.classList.remove('hidden'); }
function abrirZoomPerfil() { abrirZoom(document.getElementById('profile-img').src); }
function fecharZoomPerfil() { document.getElementById('profile-zoom-view').classList.add('hidden'); }

function abrirFeed(id) {
    document.getElementById('profile-view').classList.add('hidden');
    document.getElementById('feed-view').classList.remove('hidden');
    window.scrollTo(0, 0);
    setTimeout(() => { const el = document.getElementById(`post-${id}`); if(el) el.scrollIntoView({block: "start"}); }, 50);
}
function voltarPerfil() {
    document.getElementById('feed-view').classList.add('hidden');
    document.getElementById('profile-view').classList.remove('hidden');
    document.querySelectorAll('audio, video').forEach(el => el.pause());
}

function abrirInfo() { 
    document.getElementById('info-view').classList.remove('hidden');
    if (typeof manualTexto !== 'undefined') document.getElementById('readme-display').innerHTML = manualTexto;
}
function fecharInfo() { document.getElementById('info-view').classList.add('hidden'); }

function toggleAudio(id, btn) { const p = document.getElementById(id); if(p.paused){ p.play(); btn.innerText="🔊"; } else { p.pause(); btn.innerText="🔇"; } }
function mudarSlide(id, dir) {
    const wrapper = document.getElementById(`carousel-${id}`);
    const slides = wrapper.querySelectorAll('.carousel-slide');
    const dots = wrapper.querySelectorAll('.dot');
    let atual = Array.from(slides).findIndex(s => s.classList.contains('active'));
    slides[atual].classList.remove('active'); dots[atual].classList.remove('active');
    let novo = atual + dir;
    if(novo >= slides.length) novo = 0; if(novo < 0) novo = slides.length - 1;
    slides[novo].classList.add('active'); dots[novo].classList.add('active');
}

// === STORIES / DESTAQUES LOGIC ===
let currentStoryIndex = 0;
let currentSlideIndex = 0;
let storyTimer = null;

function abrirStory(index) {
    currentStoryIndex = index;
    currentSlideIndex = 0;
    document.getElementById('story-view').classList.remove('hidden');
    carregarSlideStory();
}

function fecharStory() {
    document.getElementById('story-view').classList.add('hidden');
    clearTimeout(storyTimer);
    document.getElementById('story-media-container').innerHTML = ""; 
}

function carregarSlideStory() {
    clearTimeout(storyTimer);
    const dadosDestaque = configuracao.destaques[currentStoryIndex];
    const midiaAtual = dadosDestaque.fotos[currentSlideIndex];
    
    document.getElementById('story-username').innerText = dadosDestaque.titulo;
    
    // CAPA DO STORY DENTRO DO VIEWER (Pequena no topo)
    // Mesma lógica: pega a primeira foto da lista
    let capaViewer = "";
    if (typeof dadosDestaque.fotos[0] === 'string') {
        capaViewer = dadosDestaque.fotos[0];
    } else {
        capaViewer = dadosDestaque.fotos[0].arquivo;
    }
    document.getElementById('story-avatar').src = caminhoMidia + capaViewer;

    // Atualiza barras
    atualizarBarrasStory(dadosDestaque.fotos.length, currentSlideIndex);

    const container = document.getElementById('story-media-container');
    container.innerHTML = "";

    let arquivo = "";
    let tipo = "imagem"; 
    let audioSrc = null;

    if (typeof midiaAtual === 'string') {
        arquivo = midiaAtual;
        if (arquivo.endsWith('.mp4')) tipo = "video";
    } else {
        arquivo = midiaAtual.arquivo;
        audioSrc = midiaAtual.audio;
        tipo = "audio-img";
    }

    if (tipo === 'video') {
        const video = document.createElement('video');
        video.src = caminhoMidia + arquivo;
        video.autoplay = true;
        video.playsInline = true; 
        video.onended = () => proximoSlideStory();
        container.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = caminhoMidia + arquivo;
        container.appendChild(img);
        if (tipo === 'audio-img' && audioSrc) {
            const audio = new Audio(caminhoMidia + audioSrc);
            audio.play().catch(e => console.log("Autoplay bloqueado"));
        }
        storyTimer = setTimeout(proximoSlideStory, 4000);
    }
}

function atualizarBarrasStory(total, atual) {
    const barsContainer = document.getElementById('story-bars');
    barsContainer.innerHTML = "";
    for (let i = 0; i < total; i++) {
        let largura = i < atual ? "100%" : (i === atual ? "100%" : "0%");
        let transicao = i === atual ? '4s' : '0s'; 
        barsContainer.innerHTML += `<div class="bar-bg"><div class="bar-fill" style="width: ${largura}; transition: width ${transicao} linear"></div></div>`;
    }
}

function proximoSlideStory() {
    const dados = configuracao.destaques[currentStoryIndex];
    if (currentSlideIndex < dados.fotos.length - 1) { currentSlideIndex++; carregarSlideStory(); } 
    else { fecharStory(); }
}

function slideAnteriorStory() {
    if (currentSlideIndex > 0) { currentSlideIndex--; carregarSlideStory(); } 
    else { currentSlideIndex = 0; carregarSlideStory(); }
}

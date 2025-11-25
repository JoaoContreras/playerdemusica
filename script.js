const playlist = [
    { titulo: 'Heretic', artista: 'Avenged Sevenfold', src: 'musicas/Avenged Sevenfold - Heretic.mp3', img: 'imagens/A7X.jpg' },
    { titulo: 'Can You Feel My Heart', artista: 'Bring Me the Horizon', src: 'musicas/Bring Me the Horizon - Can You Feel My Heart.mp3', img: 'imagens/Bring Me Horizon.jpg' },
    { titulo: 'Lost', artista: 'LP', src: 'musicas/Linkin Park - Lost.mp3', img: 'imagens/linkin park.jpg' }
];

const musica = document.querySelector('audio');
let indexMusica = 0;
let autoplayNext = false; // toca automaticamente quando avançar

const fimCampo = document.querySelector('.fim');
const inicioCampo = document.querySelector('.inicio');
const nomeDaMusica = document.querySelector('.titulo');
const nomeDoArtista = document.querySelector('.artista');
const imagem = document.querySelector('.img');
const progressEl = document.querySelector('progress');
const ponto = document.querySelector('.ponto');

const botaoPlay = document.querySelector('.botao-play');
const botaoPause = document.querySelector('.botao-pause');
const btnAnterior = document.querySelector('.anterior');
const btnProximo = document.querySelector('.proximo');

// volume elements
const volumeRange = document.getElementById('volumeRange');
const volumeIcon = document.getElementById('volumeIcon');
let previousVolume = 1; // lembra volume antes do mute

// evento play/pause e progresso
botaoPlay.addEventListener('click', TocarMusica);
botaoPause.addEventListener('click', pausarMusica);
musica.addEventListener('timeupdate', atualizarBarra);
musica.addEventListener('ended', () => { proximaMusica(); });

// metadados
musica.addEventListener('loadedmetadata', () => {
    progressEl.max = musica.duration || 0;
    fimCampo.textContent = segundoparaminutos(Math.floor(musica.duration || 0));
    atualizarBarra();
    if (autoplayNext) {
        autoplayNext = false;
        TocarMusica();
    }
});

// navegação
btnAnterior.addEventListener('click', () => {
    indexMusica--;
    if (indexMusica < 0) indexMusica = playlist.length - 1;
    // anterior NÃO autoplay por padrão
    renderizarMusica(indexMusica);
});

btnProximo.addEventListener('click', () => {
    proximaMusica();
});

function proximaMusica() {
    indexMusica++;
    if (indexMusica >= playlist.length) indexMusica = 0;
    autoplayNext = true;
    renderizarMusica(indexMusica);
}

function renderizarMusica(index) {
    if (index < 0) index = 0;
    if (index >= playlist.length) index = playlist.length - 1;
    const track = playlist[index];
    musica.src = track.src;
    nomeDaMusica.textContent = track.titulo;
    nomeDoArtista.textContent = track.artista;
    imagem.src = track.img;
    musica.load();
    // UI fica em estado "pausado" até carregar metadados e possivelmente tocar
    botaoPause.style.display = 'none';
    botaoPlay.style.display = 'block';
}

// play / pause
function TocarMusica() {
    musica.play().catch(err => {
        console.warn('play() falhou:', err);
    });
    botaoPause.style.display = 'block';
    botaoPlay.style.display = 'none';
}

function pausarMusica() {
    musica.pause();
    botaoPause.style.display = 'none';
    botaoPlay.style.display = 'block';
}

// barra de progresso
function atualizarBarra() {
    if (!musica.duration) return;
    progressEl.value = musica.currentTime;
    const pct = (musica.currentTime / musica.duration) * 100;
    ponto.style.left = pct + '%';
    inicioCampo.textContent = segundoparaminutos(Math.floor(musica.currentTime));
}

function segundoparaminutos(segundos) {
    const CampoMinutos = Math.floor(segundos / 60);
    let CampoSegundos = segundos % 60;
    if (CampoSegundos < 10) {
        CampoSegundos = '0' + CampoSegundos;
    }
    return CampoMinutos + ':' + CampoSegundos;
}

// --- Volume logic ---

// Inicializa volume do elemento audio com o valor do range
musica.volume = parseFloat(volumeRange.value || 1);
atualizaIconeVolume(musica.volume);

// mover slider altera volume
volumeRange.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value);
    musica.volume = v;
    if (v > 0) previousVolume = v; // atualiza volume anterior se não estiver mudo
    atualizaIconeVolume(v);
});

// clicar no ícone alterna mute / restore
volumeIcon.addEventListener('click', () => {
    if (musica.volume === 0) {
        // restaurar
        musica.volume = previousVolume || 0.5;
        volumeRange.value = musica.volume;
    } else {
        // mutar
        previousVolume = musica.volume;
        musica.volume = 0;
        volumeRange.value = 0;
    }
    atualizaIconeVolume(musica.volume);
});

function atualizaIconeVolume(v) {
    // limpe classes e defina conforme nível
    volumeIcon.classList.remove('fa-volume-mute', 'fa-volume-down', 'fa-volume-up');
    if (v === 0) {
        volumeIcon.classList.add('fa-volume-mute');
    } else if (v > 0 && v <= 0.5) {
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.add('fa-volume-up');
    }
}

// inicializa primeira música sem tocar
renderizarMusica(indexMusica);

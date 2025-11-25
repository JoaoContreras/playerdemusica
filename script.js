const playlist = [
    { titulo: 'Heretic', artista: 'Avenged Sevenfold', src: 'musicas/Avenged Sevenfold - Heretic.mp3', img: 'imagens/A7X.jpg' },
    { titulo: 'Can You Feel My Heart', artista: 'Bring Me the Horizon', src: 'musicas/Bring Me the Horizon - Can You Feel My Heart.mp3', img: 'imagens/Bring Me Horizon.jpg' },
    { titulo: 'Lost', artista: 'LP', src: 'musicas/Linkin Park - Lost.mp3', img: 'imagens/linkin park.jpg' }
];

const musica = document.querySelector('audio');
let indexMusica = 0;
let autoplayNext = false; // flag para indicar autoplay após carregar metadados

const fimCampo = document.querySelector('.fim');
const inicioCampo = document.querySelector('.inicio');
const nomeDaMusica = document.querySelector('.titulo');
const nomeDoArtista = document.querySelector('.artista');
const imagem = document.querySelector('.img');
const progressEl = document.querySelector('progress');
const ponto = document.querySelector('.ponto');
const barraEl = document.querySelector('.barra');

const botaoPlay = document.querySelector('.botao-play');
const botaoPause = document.querySelector('.botao-pause');
const btnAnterior = document.querySelector('.anterior');
const btnProximo = document.querySelector('.proximo');

botaoPlay.addEventListener('click', TocarMusica);
botaoPause.addEventListener('click', pausarMusica);
musica.addEventListener('timeupdate', atualizarBarra);
musica.addEventListener('ended', () => {
    proximaMusica();
});
musica.addEventListener('loadedmetadata', () => {
    progressEl.max = musica.duration || 0;
    fimCampo.textContent = segundoparaminutos(Math.floor(musica.duration || 0));
    atualizarBarra();

    // se a flag estiver ativa, toca automaticamente após metadados carregarem
    if (autoplayNext) {
        autoplayNext = false;
        TocarMusica();
    }
});

btnAnterior.addEventListener('click', () => {
    indexMusica--;
    if (indexMusica < 0) indexMusica = playlist.length - 1;
    // não ativa autoplay aqui (comportamento que você pediu)
    renderizarMusica(indexMusica);
});

btnProximo.addEventListener('click', () => {
    proximaMusica();
});

function proximaMusica() {
    indexMusica++;
    if (indexMusica >= playlist.length) indexMusica = 0;
    autoplayNext = true; // ao avançar, queremos que a próxima comece tocando
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

    // recarrega; play só será chamado no loadedmetadata se autoplayNext estiver true
    musica.load();

    // mantém UI em estado pausado até loadedmetadata acionar play (se for o caso)
    botaoPause.style.display = 'none';
    botaoPlay.style.display = 'block';
}

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

// inicializa primeira música (não toca automaticamente)
renderizarMusica(indexMusica);

const playlist = [
    { titulo: 'Heretic', artista: 'Avenged Sevenfold', src: 'musicas/Avenged Sevenfold - Heretic.mp3', img: 'imagens/A7X.jpg' },
    { titulo: 'Can You Feel My Heart', artista: 'Bring Me the Horizon', src: 'musicas/Bring Me the Horizon - Can You Feel My Heart.mp3', img: 'imagens/Bring Me Horizon.jpg' },
    { titulo: 'Lost', artista: 'LP', src: 'musicas/Linkin Park - Lost.mp3', img: 'imagens/linkin park.jpg' }
];

const musica = document.querySelector('audio');
let indexMusica = 0;

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
    // avançar pra próxima ao terminar
    proximaMusica();
});
musica.addEventListener('loadedmetadata', () => {
    // Quando metadados são carregados atualiza a duração
    progressEl.max = musica.duration || 0;
    fimCampo.textContent = segundoparaminutos(Math.floor(musica.duration || 0));
    atualizarBarra(); // atualiza posição do ponto imediatamente
});

btnAnterior.addEventListener('click', () => {
    indexMusica--;
    if (indexMusica < 0) indexMusica = playlist.length - 1;
    renderizarMusica(indexMusica);
});

btnProximo.addEventListener('click', () => {
    proximaMusica();
});

function proximaMusica() {
    indexMusica++;
    if (indexMusica >= playlist.length) indexMusica = 0;
    renderizarMusica(indexMusica);
}

function renderizarMusica(index) {
    // garante índice válido (wrap)
    if (index < 0) index = 0;
    if (index >= playlist.length) index = playlist.length - 1;
    const track = playlist[index];
    musica.src = track.src;
    nomeDaMusica.textContent = track.titulo;
    nomeDoArtista.textContent = track.artista;
    imagem.src = track.img;

    // recarrega metadados (vai disparar loadedmetadata)
    musica.load();

    // se quiser tocar automaticamente após trocar:
    // TocarMusica();
    pausarMusica(); // deixar pausado por padrão ao trocar
}

function TocarMusica() {
    musica.play().catch(err => {
        // autoplay pode falhar em alguns navegadores; apenas logamos
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
    // atualiza ponto (coloca left em percent)
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

// inicializa primeira música
renderizarMusica(indexMusica);

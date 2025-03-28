const html = document.querySelector('html');
const focoBtn = document.querySelector('.app__card-button--foco');
const curtoBtn = document.querySelector('.app__card-button--curto');
const longoBtn = document.querySelector('.app__card-button--longo');
const displayTempo = document.querySelector('#timer');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botaoIniciar = document.querySelector('#start-pause');
const duracaoFoco = 1500;
const duracaoDescansoCurto = 300;
const duracaoDescansoLongo = 900;
const btns = document.querySelectorAll('.app__card-button');
const music = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
musica.loop = true;
const audioPlay = new Audio('./sons/play.wav');
const audioPausa = new Audio('./sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3');
const iniciarOuPausarBtn = document.querySelector('#start-pause span');
const iconBtnIniciarOuPausar = document.querySelector('.app__card-primary-butto-icon');

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

function alterarContexto(contexto) {
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `./imagens/${contexto}.png`)
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
                Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `

            break;

        case 'descanso-curto':
            titulo.innerHTML = `
                Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta.</strong>
            `

            break;

        case 'descanso-longo':
            titulo.innerHTML = `
                    Hora de voltar à superfície.<br>
                    <strong class="app__title-strong">Faça uma pausa longa.</strong>
                `

            break;

        default:
            break;
    }
    btns.forEach((contexto) => (mostrarTempo(), contexto.classList.remove('active')))
}

focoBtn.addEventListener('click', () => (tempoDecorridoEmSegundos = duracaoFoco, alterarContexto('foco'), focoBtn.classList.add('active')))

curtoBtn.addEventListener('click', () => (tempoDecorridoEmSegundos = duracaoDescansoCurto, alterarContexto('descanso-curto'), curtoBtn.classList.add('active')))

longoBtn.addEventListener('click', () => (tempoDecorridoEmSegundos = duracaoDescansoLongo, alterarContexto('descanso-longo'), longoBtn.classList.add('active')))

focoBtn.addEventListener('click', () => {
    alterarContexto('foco')
    focoBtn.classList.add('active')
})

music.addEventListener('change', () => musica.paused ? musica.play() : musica.pause())

// const contagemRegressiva = () => (tempoDecorridoEmSegundos <= 0 ? (audioTempoFinalizado.play(), alert('Tempo finalizado!'), zerar()) : tempoDecorridoEmSegundos -= 1, mostrarTempo())

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        audioTempoFinalizado.play()
        alert('Tempo Finalizado')
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

// const contagemRegressiva = () => (tempoDecorridoEmSegundos <= 0 ? (alert('Tempo finalizado!'), zerar()) : tempoDecorridoEmSegundos -= 1, mostrarTempo())

botaoIniciar.addEventListener('click', iniciarPausar)

function iniciarPausar() {
    if (intervaloId) {
        audioPausa.play()
        zerar()
        iniciarOuPausarBtn.textContent = 'Começar'
        iconBtnIniciarOuPausar.setAttribute('src', './imagens/play_arrow.png')
        return
    }
    audioPlay.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBtn.textContent = 'Pausar'
    iconBtnIniciarOuPausar.setAttribute('src', './imagens/pause.png')
}

function zerar() {
    clearInterval(intervaloId)
    intervaloId = null
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' })
    displayTempo.innerHTML = `${tempoFormatado}`
}

mostrarTempo()
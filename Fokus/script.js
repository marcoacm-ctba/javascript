const html = document.querySelector('html');

const btnFoco = document.querySelector('.app__card-button--foco');
const btnCurto = document.querySelector('.app__card-button--curto');
const btnLongo = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const btnStartPause = document.querySelector('#start-pause')
const imgStartPause = document.querySelector('.app__card-primary-butto-icon')

const musicaInput = document.querySelector('#alternar-musica')
const audio = new Audio('sons/luna-rise-part-one.mp3')

const playAudio = new Audio('sons/play.wav')
const pauseAudio = new Audio('sons/pause.mp3')
const beepAudio = new Audio('sons/beep.mp3')

const txtStartPause = document.querySelector('#start-pause span')
const temporizador = document.querySelector('#timer')

let tempoDecorridoEmSegundos = 10
let tempoDecorridoAnterior = 1500
let intervalo = null

audio.loop = true

musicaInput.addEventListener('change', () => {
    if(audio.paused)
        audio.play()
    else audio.pause()
})

btnFoco.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 10
    tempoDecorridoAnterior = 1500
    alterarContexto('foco')
    btnFoco.classList.add('active')
})

btnCurto.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300
    tempoDecorridoAnterior = 300
    alterarContexto('descanso-curto')
    btnCurto.classList.add('active')
})

btnLongo.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    tempoDecorridoAnterior = 900
    alterarContexto('descanso-longo')
    btnLongo.classList.add('active') 
})


function alterarContexto(contexto) {
    mostrarTemporizador()
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `imagens/${contexto}.png`)
    botoes.forEach(function(botao) {
        botao.classList.remove('active')
    })

    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            ` 
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        beepAudio.play()
        zerarContagem()
        tempoDecorridoEmSegundos = tempoDecorridoAnterior
        mostrarTemporizador()
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if(focoAtivo) {
            const evento = new CustomEvent('FocoPersonalizado')
            document.dispatchEvent(evento)
        }
        return
    }
   
    tempoDecorridoEmSegundos -= 1
    txtStartPause.textContent = 'Pausar'
    imgStartPause.setAttribute('src', 'imagens/pause.png')
    mostrarTemporizador()  
}

function mostrarTemporizador() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-BR', {minute: '2-digit', second: '2-digit'})
    temporizador.innerHTML = `${tempoFormatado}`
}

function iniciarOuPausarContagem() {
    
    if(intervalo) {
        pauseAudio.play()        
        zerarContagem()
        return
    }
    else {
        playAudio.play()
        intervalo = setInterval(contagemRegressiva, 1000)
    } 
}

function zerarContagem() {
    clearInterval(intervalo)
    imgStartPause.setAttribute('src', 'imagens/play_arrow.png')
    txtStartPause.textContent = 'Começar'
    intervalo = null
}

btnStartPause.addEventListener('click', iniciarOuPausarContagem)
mostrarTemporizador()

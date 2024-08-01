//encontrar o elemento Adicionar Tarefa
const btnAdicionarTarefa = document.querySelector('.app__button--add-task')
const formAdicionarTarefa = document.querySelector('.app__form-add-task')
const textArea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')

const paragrafoTarefaEmAndamento = document.querySelector('.app__section-active-task-description')
const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel')
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarArmazenamentoTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden')
    if(formAdicionarTarefa.classList.contains('hidden'))
        textArea.value = ''
})

btnCancelarTarefa.addEventListener('click', () => {
    textArea.value = ''
    formAdicionarTarefa.classList.add('hidden')
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    } 
    tarefas.push(tarefa)
    inserirElementoTarefaUl(tarefa)
    atualizarArmazenamentoTarefas()

    textArea.value = ''
    formAdicionarTarefa.classList.add('hidden')
})

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
                <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    if(tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    }
    else {
        botao.onclick = () => {
            const novaDescricao = prompt("Qual o novo nome da tarefa?")
    
            if(novaDescricao) {
                paragrafo.textContent = novaDescricao
                tarefa.descricao = novaDescricao
                atualizarArmazenamentoTarefas()
            }        
        }
    }

   

    const imagem = document.createElement('img')
    imagem.setAttribute('src', 'imagens/edit.png')

    botao.append(imagem)

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    li.onclick = () => {
        document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
            elemento.classList.remove('app__section-task-list-item-active')
        })

        if(tarefaSelecionada == tarefa) {
            paragrafoTarefaEmAndamento.textContent = ''
            tarefaSelecionada = null
            liTarefaSelecionada = null
        }
        else {
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoTarefaEmAndamento.textContent = tarefa.descricao        
            li.classList.add('app__section-task-list-item-active')
        }        
    }


    return li
}

function inserirElementoTarefaUl(tarefa) {
    const li = criarElementoTarefa(tarefa)
    ulTarefas.append(li)
}

tarefas.forEach(tarefa => {
    inserirElementoTarefaUl(tarefa)
});

document.addEventListener('FocoPersonalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarArmazenamentoTarefas()
    }
})

const removerTarefas = (somenteCompletas) => {
    const nomeClasse = somenteCompletas ? ".app__section-task-list-item-complete" : "app__section-task-list-item"
    document.querySelectorAll(nomeClasse).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarArmazenamentoTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)
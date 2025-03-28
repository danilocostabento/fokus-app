const btnAddTask = document.querySelector('.app__button--add-task')
const formAddTask = document.querySelector('.app__form-add-task')
const textArea = document.querySelector('.app__form-textarea')
const ulTasks = document.querySelector('.app__section-task-list')
const cancelBtn = document.querySelector('.app__form-footer__button--cancel');
const activeTasks = document.querySelector('.app__section-active-task-description')
const btnRemoveComplete = document.querySelector('#btn-remover-concluidas')
const btnRemoveAll = document.querySelector('#btn-remover-todas')

let tasks = JSON.parse(localStorage.getItem('tarefas')) || []

let activeTask = null
let activeTaskLi = null

function refreshTasks() {
  localStorage.setItem('tarefas', JSON.stringify(tasks))
}

function addTask(task) {
  const li = document.createElement('li')
  li.classList.add('app__section-task-list-item')

  const svg = document.createElement('svg')
  svg.innerHTML = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>`

  const paragraph = document.createElement('p')
  paragraph.textContent = task.description
  paragraph.classList.add('app__section-task-list-item-description')

  const btn = document.createElement('button')
  const imgBtn = document.createElement('img')

  btn.onclick = () => {
    const newName = prompt('Qual o novo nome da tarefa?')

    // newName === null ? alert('Cancelando') : newName !== '' ? (paragraph.textContent = newName, task.description = newName) : alert('A descrição não pode estar vazia')

    if(newName === null) {
      alert('Cancelando...')
    } else if(newName) {
      paragraph.textContent = newName 
      task.description = newName
    } else {
      alert('A descrição não pode estar vazia')
    }

    refreshTasks()
  }

  imgBtn.setAttribute('src', './imagens/edit.png')
  btn.append(imgBtn)
  btn.classList.add('app_button-edit')

  li.append(svg)
  li.append(paragraph)
  li.append(btn)

  if(task.completa) {
    li.classList.add('app__section-task-list-item-complete')
    btn.setAttribute('disabled', 'disabled')
  } else {
    li.onclick = () => {
      document.querySelectorAll('.app__section-task-list-item-active')
        .forEach (elemento => elemento.classList.remove('app__section-task-list-item-active'))
  
      if(activeTask == task) {
        activeTasks.textContent = ''
        activeTask = null
        activeTaskLi = null
        return
      } 
  
      activeTask = task
      activeTaskLi = li
      activeTasks.textContent = task.description
      
      li.classList.add('app__section-task-list-item-active')
    
    }
  }

  return li
}

const clearForm = () => {textArea.value = '', formAddTask.classList.add('hidden')}

cancelBtn.addEventListener('click', clearForm)

btnAddTask.addEventListener('click', () => formAddTask.classList.toggle('hidden'))

formAddTask.addEventListener('submit', (evento) => {
  evento.preventDefault()
  const task = {
    description: textArea.value
  }
  tasks.push(task)
  ulTasks.append(addTask(task))
  refreshTasks()
  textArea.value = ''
  formAddTask.classList.add('hidden')
})

tasks.forEach(task => ulTasks.append(addTask(task)));

document.addEventListener('FocoFinalizado', () => {
  if (activeTask && activeTaskLi) {
    activeTaskLi.classList.remove('app__section-task-list-item-active')
    activeTaskLi.classList.add('app__section-task-list-item-complete')
    activeTaskLi.querySelector('button').setAttribute('disabled', 'disabled')
    activeTask.completa = true
    refreshTasks()
  }
})

const removeTask = (onlyComplete) => {
  const seletor = onlyComplete ? '.app__section-task-list-item-complete' : ".app__section-task-list-item"
  document.querySelectorAll(seletor).forEach(elemento => {elemento.remove()})
  tasks = onlyComplete ? tasks.filter(task => !task.completa) : []
  refreshTasks()
}

btnRemoveComplete.onclick = () => removeTask(true)

btnRemoveAll.onclick = () => removeTask(false)
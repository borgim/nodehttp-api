import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { getCurrentDateWithoutHours } from './utils/getCurrentDateWithoutHours.js'

const databasePath = new URL("../db.json", import.meta.url)

const currentDate = getCurrentDateWithoutHours(new Date())

export class Database {
  // task = { id, title, ddescription, created_at, updated_at, completed_at }
  #tasks = []

  constructor() {
    fs.readFile(databasePath, 'utf8').then(data => {
      this.#tasks = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#tasks))
  }

  select(search) {

    if (search) {
      const searchedTask = this.#tasks.filter(task => task.title.includes(search) || task.description.includes(search))

      return searchedTask
    }

    return this.#tasks
  }

  insert(task) {
    const taskToCheckIfExists = this.#tasks.findIndex(item => item.title === task.title)

    if (taskToCheckIfExists > -1) {
      throw new Error("Task já existe no banco de dados")
    }

    const taskWithRandomId = {
      id: randomUUID(),
      ...task
    }

    this.#tasks.push(taskWithRandomId)

    this.#persist()
  }

  // atualizar apenas título e/ou descrição
  update(taskId, whatChange, newContent) {
    const taskToCheckIfExists = this.#tasks.findIndex(task => task.id === taskId)

    if (taskToCheckIfExists > -1) {
      this.#tasks[taskToCheckIfExists][whatChange] = newContent
      this.#tasks[taskToCheckIfExists]["updated_at"] = currentDate

      this.#persist()
    } else {
      throw new Error("Task não existe no banco de dados")
    }
  }

  delete(taskId) {
    const taskToDelete = this.#tasks.findIndex(task => task.id === taskId)

    if (taskToDelete > -1) {
      this.#tasks.splice(taskToDelete, 1)
      this.#persist()
    } else {
      throw new Error("Task não existe no banco de dados")
    }
  }

  // marcar ou desmarcar como completa
  patch(taskId) {
    const taskToMarkAsComplete = this.#tasks.findIndex(task => task.id === taskId)

    const taskFieldToUpdate = this.#tasks[taskToMarkAsComplete]["completed_at"]

    if (taskToMarkAsComplete > -1) {
      if (taskFieldToUpdate === null) {
        this.#tasks[taskToMarkAsComplete]["completed_at"] = currentDate
      } else {
        this.#tasks[taskToMarkAsComplete]["completed_at"] = null
      }

      this.#persist()
    } else {
      throw new Error("Task não existe no banco de dados")
    }
  }

}

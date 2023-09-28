import { Database } from "./database.js"
import { buildRoutePath } from "./utils/buildRoutePath.js"
import { getCurrentDateWithoutHours } from './utils/getCurrentDateWithoutHours.js'

const date = new Date()
const database = new Database()

const currentFormattedDate = getCurrentDateWithoutHours(date)

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {

      const { search } = req.query

      const tasks = database.select(search)

      const formatedTasks = {
        tasks
      }

      return res.end(JSON.stringify(formatedTasks))
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body

      const formatedTitleForValidation = title.trim()
      const formatedDescriptionForValidation = description.trim()

      if (!formatedTitleForValidation || !formatedDescriptionForValidation) {
        res.statusCode = 400

        return res.end()
      }

      const task = {
        title,
        description,
        "completed_at": null,
        "updated_at": null,
        "created_at": currentFormattedDate
      }

      try {
        database.insert(task)

        res.statusCode = 201
        res.end()
      } catch (error) {

        const errorReturn = {
          message: error.message
        }

        res.statusCode = 409
        res.end(JSON.stringify(errorReturn))
      }
    }
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:taskId"),
    handler: (req, res) => {

      const { taskId } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        const errorReturn = {
          message: "Só é possível modificar title ou description"
        }

        res.statusCode = 400

        return res.end(JSON.stringify(errorReturn))
      }

      try {
        if (title) {
          database.update(taskId, "title", title);
        }

        if (description) {
          database.update(taskId, "description", description);
        }

        res.end();
      } catch (error) {
        const errorReturn = {
          message: error.message
        }

        res.statusCode = 404

        res.end(JSON.stringify(errorReturn))
      }
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:taskId"),
    handler: (req, res) => {
      const { taskId } = req.params

      try {
        database.delete(taskId)

        res.statusCode = 204

        res.end()
      }
      catch (error) {
        const errorReturn = {
          message: error.message
        }

        res.statusCode = 404

        res.end(JSON.stringify(errorReturn))
      }
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:taskId/complete"),
    handler: (req, res) => {
      const { taskId } = req.params

      try {
        database.patch(taskId)

        res.end()
      }
      catch (error) {
        const errorReturn = {
          message: error.message
        }

        res.statusCode = 404

        res.end(JSON.stringify(errorReturn))
      }
    }
  },
]

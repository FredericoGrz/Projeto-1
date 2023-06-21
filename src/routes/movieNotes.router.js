const { Router } = require("express")
const MovieNotesController = require("../controller/MovieNotesController")

const movieNotesController = new MovieNotesController()

const movieNotesRouter = Router()

movieNotesRouter.get("/:user_id", movieNotesController.index)
movieNotesRouter.get("/:user_id/:id", movieNotesController.show)
movieNotesRouter.post("/:user_id", movieNotesController.create)
movieNotesRouter.put("/:user_id/:id", movieNotesController.update)
movieNotesRouter.delete("/:user_id/:id", movieNotesController.delete)

module.exports = movieNotesRouter
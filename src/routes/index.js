const { Router } = require("express")

const userRouter = require("./users.router")
const movieNotesRouter = require("./movieNotes.router")

const routes = Router()

routes.use("/users", userRouter)
routes.use("/movieNotes", movieNotesRouter)

module.exports = routes
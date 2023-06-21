const { Router } = require("express")

const UserController = require("../controller/UserController")

const userController = new UserController()

const userRouter = Router()

userRouter.get("/", userController.index)
userRouter.get("/:id", userController.show)
userRouter.post("/", userController.create)
userRouter.put("/:id", userController.update)
userRouter.delete("/:id", userController.delete)

module.exports = userRouter

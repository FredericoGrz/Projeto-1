require("express-async-errors")

const express = require("express")

const AppError = require("./utils/AppError")

const routes = require("./routes")

const app = express()

const PORT = 3333
app.use(express.json())
app.use(routes)
app.use((error, req, res, next) => {
  if (error instanceof AppError)
    res.status(error.status).json({ Status: "Error", message: error.message })
  else
    res.status(500).json({ Status: "Server Error", message: error.message })
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
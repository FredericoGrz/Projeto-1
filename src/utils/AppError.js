class AppError {
  message
  status
  constructor(message, status = 400) {
    this.message = message
    this.status = status
  }
}

module.exports = AppError
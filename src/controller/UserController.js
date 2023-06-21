const { hash, compare } = require("bcryptjs")
const knex = require("../database/knex")

const AppError = require("../utils/AppError")

class UserController {

  async index(req, res) {
    try {
      const users = await knex("users").select()
      res.status(200).json(users)

    } catch (error) {
      throw new AppError("Erro ao selecionar usuarios")
    }
  }

  async show(req, res) {
    const { id } = req.params
    const user = await knex("users").where({ id }).first()

    if (!user)
      throw new AppError("Usuario nao encontrado")

    res.status(200).json(user)
  }

  async create(req, res) {
    try {
      const { name, email, password, avatar } = req.body
      const allRequiredDataAvailable = name && email && password
      const emailAlreadyExists = await knex("users").select().where({ email }) === [] ? true : false
      if (!allRequiredDataAvailable)
        throw new AppError("Por Favor preencha todos os campos necessarios")
      if (emailAlreadyExists)
        throw new AppError("Email já esta em uso!")

      const hashedPassword = await hash(password, 10)

      await knex("users").insert({ name, email, password: hashedPassword, avatar })

      res.status(201).json()
    } catch (error) {
      throw new AppError(error.message)
    }

  }

  async update(req, res) {
    const { id } = req.params
    const { name, email, password, oldPassword, avatar } = req.body
    const missingOldPassword = password && !oldPassword
    const isUpdatingEmail = email
    const user = await knex("users").select().where({ id }).first()
    if (!user)
      throw new AppError("Usuario nao encontrado para alteracao")

    if (isUpdatingEmail) {
      const userByEmail = await knex("users").select().where({ email }).first()
      const emailAlreadyExists = userByEmail && userByEmail.id !== user.id
      if (emailAlreadyExists)
        throw new AppError("Este email já pertence a outra conta")
    }

    if (missingOldPassword)
      throw new AppError("Senha Antiga é necessaria")

    if (oldPassword) {
      const oldPasswordIsCorrect = await compare(oldPassword, user.password)
      if (oldPasswordIsCorrect)
        user.password = await hash(password, 10)
      else
        throw new AppError("A senha antiga esta incorreta")
    }

    user.name = name || user.name
    user.email = email || user.email
    user.avatar = avatar || user.avatar
    user.updated_at = knex.fn.now()
    await knex("users").where({ id }).update(user)

    res.status(200).json()
  }

  async delete(req, res) {
    try {
      const { id } = req.params

      await knex("users").where({ id }).delete()
      res.status(200).json()
    } catch (error) {
      throw new AppError(error.message)
    }

  }
}

module.exports = UserController
const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class movieNotesController {

  async index(req, res) {
    try {
      const { user_id } = req.params
      let tags = []
      let movieNotes = await knex("movie_notes").where({ user_id })

      movieNotes = await Promise.all(movieNotes.map(async note => {
        note.tags = await knex("movie_tags").select("id", "name").where({ user_id, note_id: note.id })
        return note
      }))

      res.status(200).json(movieNotes)

    } catch (error) {
      throw new AppError("Erro ao buscar as notas por usuario")
    }
  }

  async show(req, res) {
    try {
      const { user_id, id } = req.params

      const note = await knex("movie_notes").where({ id, user_id }).first()
      note.tags = await knex("movie_tags").select("id", "name").where({ user_id, note_id: id })

      if (!note)
        throw new AppError("Nota nao encontrada")

      res.status(200).json(note)

    } catch (error) {
      const message = error.message || "Erro ao buscar uma nota"
      throw new AppError(message)
    }
  }


  async create(req, res) {
    try {
      const { user_id } = req.params
      const { title, description, rating, tags } = req.body
      const isAllRequiredDataAvailable = user_id && title && typeof (rating) === "number"
      const isValidRating = rating > 0 && rating <= 5
      const shouldAddTags = typeof tags !== "undefined"

      if (!isAllRequiredDataAvailable)
        throw new AppError("Preencha todos os campos necessarios")
      if (!isValidRating)
        throw new AppError("Preencha uma nota valida (entre 1 e 5)")

      const [note] = await knex("movie_notes").insert({ title, description, rating, user_id }).returning("id")

      if (shouldAddTags) {
        if (!note.id)
          throw new AppError()

        tags.forEach(async tag => {
          await knex("movie_tags").insert({ name: tag, user_id, note_id: note.id })
        });
      }
      res.status(201).json()

    } catch (error) {
      const message = error.message || "Erro ao criar uma nova nota"
      throw new AppError(message)
    }
  }

  async update(req, res) {
    try {
      const { user_id, id } = req.params
      const { title, description, rating, tags } = req.body
      const movieNote = await knex("movie_notes").where({ user_id, id }).first()

      const allRequiredFieldsAvailable = user_id && id
      const isUpdatingRating = typeof (rating) === "number"
      const isValidRating = rating > 0 && rating <= 5
      const shouldUpdateTags = typeof tags !== "undefined"

      if (!movieNote)
        throw new AppError("Nota de filme nao encontrada")
      if (!allRequiredFieldsAvailable)
        throw new AppError("Preencha todos os campos necessarios")
      if (isUpdatingRating && !isValidRating)
        throw new AppError("Preencha uma nota valida (entre 1 e 5)")

      movieNote.title = title || movieNote.title
      movieNote.description = description || movieNote.description
      movieNote.rating = rating || movieNote.rating
      movieNote.updated_at = knex.fn.now()

      await knex("movie_notes").where({ user_id, id }).update(movieNote)

      if (shouldUpdateTags) {
        const oldTags = await knex("movie_tags").where({ user_id, note_id: id })

        if (oldTags) {
          oldTags.forEach(async tag => {
            await knex("movie_tags").where({ id: tag.id }).delete()
          })
        }

        tags.forEach(async tag => {
          await knex("movie_tags").insert({ name: tag, user_id, note_id: id })
        })
      }

      res.status(200).json()

    } catch (error) {
      const message = error.message || "Erro ao atualizar uma nota"
      throw new AppError(message)
    }
  }

  async delete(req, res) {
    try {
      const { user_id, id } = req.params

      await knex("movie_notes").where({ user_id, id }).delete()

      res.status(200).json()
    } catch (error) {
      const message = error.message || "Erro ao deletar uma nota"
      throw new AppError(message)
    }
  }

}

module.exports = movieNotesController
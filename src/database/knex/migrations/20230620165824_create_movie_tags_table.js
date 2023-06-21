exports.up = knex => {
  return knex.schema.createTable("movie_tags", table => {
    table.increments("id").primary()
    table.string("name").notNullable()
    table.integer("note_id").notNullable()
    table.foreign("note_id").references("movie_notes.id").onDelete('CASCADE')
    table.integer("user_id").notNullable()
    table.foreign("user_id").references("users.id").onDelete('CASCADE')
  })
}


exports.down = knex => knex.schema.dropTable("movie_tags")

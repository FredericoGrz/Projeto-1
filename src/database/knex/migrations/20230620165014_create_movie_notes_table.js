exports.up = knex => {
  return knex.schema.createTable("movie_notes", table => {
    table.increments("id").primary()
    table.string("title").notNullable()
    table.string("description")
    table.integer("rating").notNullable()
    table.integer("user_id").notNullable()
    table.foreign("user_id").references("users.id").onDelete('CASCADE')
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}


exports.down = knex => knex.schema.dropTable("movie_notes")

import Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.alterTable('users', (table) => {
    table.text('avatar').notNullable().alter()
    table.text('bio').notNullable().alter()
  })
}

export async function down(knex: Knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('avatar').notNullable().alter()
    table.string('bio').notNullable().alter()
  })
}

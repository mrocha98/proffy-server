import knex from 'knex'

const {
  NODE_ENV,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_PORT,
  DATABASE_URL
} = process.env

const devConnection = knex({
  client: 'pg',
  version: '12',
  searchPath: ['knex', 'public'],
  debug: true,
  connection: {
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASS,
    port: DATABASE_PORT
  }
})

const prodConnection = knex({
  client: 'pg',
  version: '12',
  searchPath: ['knex', 'public'],
  debug: false,
  connection: DATABASE_URL
})

export default NODE_ENV === 'production' ? prodConnection : devConnection

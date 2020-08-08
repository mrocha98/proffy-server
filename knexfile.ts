import './src/loadEnv'
import path from 'path'

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_PORT,
  DATABASE_URL,
  NODE_ENV
} = process.env

const connection =
  NODE_ENV === 'production'
    ? DATABASE_URL
    : {
        host: DATABASE_HOST,
        database: DATABASE_NAME,
        user: DATABASE_USER,
        password: DATABASE_PASS,
        port: DATABASE_PORT
      }

module.exports = {
  client: 'pg',
  version: '12',
  searchPath: ['knex', 'public'],
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  connection
}

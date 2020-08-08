import './loadEnv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

import routes from './routes'

const { PORT } = process.env

const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors())

app.use(routes)

app.listen(PORT || 3333)

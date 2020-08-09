import { Request, Response } from 'express'
import { BAD_REQUEST, CREATED } from 'http-status-codes'

import db from '../database/connection'

class ConnectionsController {
  async index(req: Request, res: Response) {
    try {
      const totalConnections = await db('connections').count('* as total')

      const { total } = totalConnections[0]

      return res.json({ total })
    } catch {
      return res.status(BAD_REQUEST).json({ message: 'Erro inesperado ao calcular total de conexões' })
    }
  }

  async store(req: Request, res: Response) {
    const { user_id } = req.body

    if (!user_id) return res.status(BAD_REQUEST).json({ message: 'ID não foi informado' })

    try {
      await db('connections').insert({ user_id })
      return res.sendStatus(CREATED)
    } catch {
      return res.status(BAD_REQUEST).json({ message: 'Erro inesperado ao criar conexão' })
    }
  }
}

export default new ConnectionsController()

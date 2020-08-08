import { Request, Response } from 'express'
import { BAD_REQUEST, CREATED } from 'http-status-codes'

import db from '../database/connection'
import convertHoursToMinutes from '../utils/convertHoursToMinutes'

interface ScheduleItem {
  week_day: number
  from: string
  to: string
}

class ClassesController {
  async index(req: Request, res: Response) {
    const filters = req.query

    if (!filters.week_day || !filters.subject || !filters.time)
      return res.status(BAD_REQUEST).json({ error: 'Faltando um ou mais filtros para buscar as aulas' })

    const subject = filters.subject as string
    const week_day = filters.week_day as string
    const time = filters.time as string

    const timeInMinutes = convertHoursToMinutes(time)

    try {
      const classes = await db('classes')
        .whereExists(function Exists() {
          this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('class_schedule.class_id = classes.id')
            .whereRaw('class_schedule.week_day = ??', [Number(week_day)])
            .whereRaw('class_schedule.from <= ??', [timeInMinutes])
            .whereRaw('class_schedule.to > ??', [timeInMinutes])
        })
        .where('classes.subject', subject)
        .join('users', 'classes.user_id', 'users.id')
        .select(['classes.*', 'users.*'])

      return res.json(classes)
    } catch {
      return res.status(BAD_REQUEST).json({ error: 'Erro inesperado ao consultar dados no servidor...' })
    }
  }

  async store(req: Request, res: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body

    try {
      await db.transaction(async (trx) => {
        const insertedUserIds = await trx('users').insert({ name, avatar, whatsapp, bio }).returning('id')
        const user_id = insertedUserIds[0]

        const insertedClassesIds = await trx('classes').insert({ subject, cost, user_id }).returning('id')
        const class_id = insertedClassesIds[0]

        const classSchedule = schedule.map(({ week_day, from, to }: ScheduleItem) => {
          return {
            class_id,
            week_day,
            from: convertHoursToMinutes(from),
            to: convertHoursToMinutes(to)
          }
        })

        await trx('class_schedule').insert(classSchedule)

        return res.sendStatus(CREATED)
      })
    } catch {
      return res.status(BAD_REQUEST).json({ error: 'Erro inesperado ao tentar cadastrar aulas...' })
    }
  }
}

export default new ClassesController()

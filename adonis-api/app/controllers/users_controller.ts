import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'

export default class UsersController {
  async create({ request, response }: HttpContext) {
    // Create a new user

    const { email, password, fullName } = request.only(['email', 'password', 'fullName'])

    const trx = await Database.transaction()

    try {
      const newUser = await User.create({ email, password, fullName })

      await trx.commit()

      return newUser
    } catch (error) {
      await trx.rollback()
      return response.badRequest({ error: error.message })
    }
  }
}

import request from 'supertest'
import app from '../../../src/app'
import { Games } from '../../../src/api/game/entity'
import { Words } from '../../../src/api/words/entity'
import { Users } from '../../../src/api/users/entity'
import { AppDataSource } from '../../../src/db/db'
import * as bcrypt from 'bcrypt'

export const beforeHandler = async (): Promise<void> => {
  await AppDataSource.initialize()
  const usersRepository = AppDataSource.getRepository(Users)
  const gamesRepository = AppDataSource.getRepository(Games)
  const wordsRepository = AppDataSource.getRepository(Words)

  await usersRepository.delete({})
  await gamesRepository.delete({})
  await wordsRepository.delete({})

  const userQuery = new Users()
  userQuery.username = String(process.env.USERNAME_TEST)
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(String(process.env.PASSWORD_TEST), salt)
  userQuery.password = String(hash)
  await usersRepository.save(userQuery)
}
export const afterHandler = async (): Promise<void> => {
  const usersRepository = AppDataSource.getRepository(Users)
  const gamesRepository = AppDataSource.getRepository(Games)
  const wordsRepository = AppDataSource.getRepository(Words)

  await usersRepository.delete({})
  await gamesRepository.delete({})
  await wordsRepository.delete({})
  await AppDataSource.destroy()
}
export const testPost = async (query: reqBody, location: string): Promise<any> => {
  const response = await request(app)
    .post(`/api/users/${location}`)
    .set('Accept', 'application/json')
    .send(query)
  return response
}
export interface reqBody {
  username: string
  password: string
}

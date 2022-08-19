import request from 'supertest'
import app from '../../src/app'
import { Games } from '../../src/api/game/entity'
import { Words } from '../../src/api/words/entity'
import { Users } from '../../src/api/users/entity'
import { AppDataSource } from '../../src/db/db'
import * as bcrypt from 'bcrypt'

export const beforeHandler = async (): Promise<void> => {
  await AppDataSource.initialize()
  const usersRepository = AppDataSource.getRepository(Users)
  const gamesRepository = AppDataSource.getRepository(Games)
  const wordsRepository = AppDataSource.getRepository(Words)

  await gamesRepository.delete({})
  await usersRepository.delete({})
  await wordsRepository.delete({})

  const userQuery = new Users()
  userQuery.username = String(process.env.USERNAME_TEST)
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(String(process.env.PASSWORD_TEST), salt)
  userQuery.password = String(hash)
  userQuery.totalGames = 10
  userQuery.victories = 5
  const userResponse = await usersRepository.save(userQuery)
  const newWord = new Words()
  newWord.word = 'fffff'
  newWord.isActive = true
  newWord.totalHits = 10
  newWord.totalPlayed = 11
  const wordResponse = await wordsRepository.save(newWord)
  const newGame = new Games()
  userResponse.totalGames += 1
  newGame.isActive = true
  newGame.attempts = 1
  newGame.users = userResponse
  newGame.words = wordResponse
  newGame.win = false
  await gamesRepository.save(newGame)
}
export const afterHandler = async (): Promise<void> => {
  const usersRepository = AppDataSource.getRepository(Users)
  const gamesRepository = AppDataSource.getRepository(Games)
  const wordsRepository = AppDataSource.getRepository(Words)

  await gamesRepository.delete({})
  await usersRepository.delete({})
  await wordsRepository.delete({})
  await AppDataSource.destroy()
}
export const testPostUsers = async (query: reqBody, location: string): Promise<any> => {
  const response = await request(app)
    .post(`/api/users/${location}`)
    .set('Accept', 'application/json')
    .send(query)
  return response
}
export const testPostWord = async (query: reqBodyWords, location: string, TOKEN: string): Promise<any> => {
  const response = await request(app)
    .post(`/api/game/${location}`)
    .set('Accept', 'application/json')
    .set('x-access-token', `${TOKEN}`)
    .send(query)
  return response
}
export const testGet = async (location: string, TOKEN: string = ''): Promise<any> => {
  const response = await request(app)
    .get(`/api/users/${location}`)
    .set('x-access-token', `${TOKEN}`)
  return response
}

export const testGetGame = async (location: string, TOKEN: string = ''): Promise<any> => {
  const response = await request(app)
    .get(`/api/game/${location}`)
    .set('x-access-token', `${TOKEN}`)
  return response
}

export interface reqBody {
  username: string
  password: string
}
export interface reqBodyWords {
  user_word: string
}

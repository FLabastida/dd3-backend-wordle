import { testGetGame, testPostUsers, testPostWord, beforeHandler, afterHandler, reqBody, reqBodyWords } from '../helpers/helper'

describe('TEST /game', () => {
  jest.setTimeout(3000)
  beforeAll(async () => {
    await beforeHandler()
  })
  afterAll(async () => {
    await afterHandler()
  })

  it('should be response with top words', async () => {
    const query: reqBody = {
      username: String(process.env.USERNAME_TEST),
      password: String(process.env.PASSWORD_TEST)
    }
    const getToken = await testPostUsers(query, '/login')

    const response = await testGetGame('/top-words', getToken.body.token)
    await expect(response.statusCode).toBe(200)
    await expect(response.headers['content-type']).toMatch(/application\/json/)
    await expect(response.body).toHaveProperty('top_words')
  })
  it('should be play game', async () => {
    const query: reqBody = {
      username: String(process.env.USERNAME_TEST),
      password: String(process.env.PASSWORD_TEST)
    }
    const getToken = await testPostUsers(query, '/login')
    const word: reqBodyWords = {
      user_word: 'ABCDE'
    }
    const response = await testPostWord(word, '/word', getToken.body.token)
    await expect(response.statusCode).toBe(200)
    await expect(response.headers['content-type']).toMatch(/application\/json/)
    await expect(response.body).toHaveProperty('response')
    const arrWord = [...word.user_word]
    response.body.response.map(async (data: any, i: number) => {
      await expect(data).toHaveProperty('letter', arrWord[i])
      await expect(data).toHaveProperty('value', 1 | 2 | 3)
    })
  })
})

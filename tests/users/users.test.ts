import { testGet, testPostUsers, beforeHandler, afterHandler, reqBody } from '../helpers/helper'
describe('TEST /users ', () => {
  jest.setTimeout(3000)
  beforeAll(async () => {
    await beforeHandler()
  })
  afterAll(async () => {
    await afterHandler()
  })
  it('can be registered', async () => {
    const query: reqBody = {
      username: 'testReg@test.dev',
      password: String(process.env.PASSWORD_TEST)
    }
    const response = await testPostUsers(query, '/')
    await expect(response.statusCode).toBe(200)
    await expect(response.headers['content-type']).toMatch(/application\/json/)
    await expect(response.body).toHaveProperty('message', 'Successfully register')
    const validRegister = await testPostUsers(query, '/login')
    await expect(validRegister.statusCode).toBe(200)
    await expect(validRegister.headers['content-type']).toMatch(/application\/json/)
    await expect(validRegister.body).toHaveProperty('token')
    await expect(validRegister.body).toHaveProperty('message', 'Successfully login')
  })
  it('should be login', async () => {
    const query: reqBody = {
      username: String(process.env.USERNAME_TEST),
      password: String(process.env.PASSWORD_TEST)
    }
    const response = await testPostUsers(query, '/login')
    await expect(response.statusCode).toBe(200)
    await expect(response.headers['content-type']).toMatch(/application\/json/)
    await expect(response.body).toHaveProperty('token')
    await expect(response.body).toHaveProperty('message', 'Successfully login')
  })
  test('if error on wrong password', async () => {
    const query: reqBody = {
      username: String(process.env.USERNAME_TEST),
      password: 'wrongPassword'
    }
    const response = await testPostUsers(query, '/login')
    await expect(response.statusCode).toBe(400)
    await expect(response.headers['content-type']).toMatch(/application\/json/)
    await expect(response.body).toHaveProperty('message', 'Wrong credentials')
  })
  test('if error on wrong username', async () => {
    const query: reqBody = {
      username: 'username',
      password: 'wrongPassword'
    }
    const response = await testPostUsers(query, '/login')
    await expect(response.statusCode).toBe(400)
    await expect(response.headers['content-type']).toMatch(/application\/json/)
    await expect(response.body).toHaveProperty('message', 'User not found')
  })
  it('should be response with top-ten users', async () => {
    const query: reqBody = {
      username: String(process.env.USERNAME_TEST),
      password: String(process.env.PASSWORD_TEST)
    }
    const getToken = await testPostUsers(query, '/login')

    const response = await testGet('top-ten', getToken.body.token)
    await expect(response.statusCode).toBe(200)
    await expect(response.headers['content-type']).toMatch(/application\/json/)
    await expect(response.body).toHaveProperty('top_ten')
    await expect(response.body).toHaveProperty('message', 'Successfully get top-ten users')
  })
  it('should be response with user stats', async () => {
    const query: reqBody = {
      username: String(process.env.USERNAME_TEST),
      password: String(process.env.PASSWORD_TEST)
    }
    const getToken = await testPostUsers(query, '/login')
    const response = await testGet('/stats', getToken.body.token)
    await expect(response.statusCode).toBe(200)
    await expect(response.headers['content-type']).toMatch(/application\/json/)
    await expect(response.body).toHaveProperty('user_stats')
    await expect(response.body).toHaveProperty('message', 'Successfully get user stats')
  })
})

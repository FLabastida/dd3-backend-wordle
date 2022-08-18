import configSetup from '../../config/appConfig'
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { Users } from './entity'
import { AppDataSource } from '../../db/db'
interface dataBody {
  username: string
  password: string
}
interface dataResponse {
  token: string
  message: string
}
export const login = async (data: dataBody): Promise<dataResponse> => {
  const { username, password } = data
  const secretToken = String(configSetup.SECRET)
  try {
    const usersRepository = AppDataSource.getRepository(Users)
    const userFound = await usersRepository.findOne({
      where: {
        username
      }
    })
    if (userFound === null) {
      return { token: '', message: 'User not found' }
    }

    const comparePassword = await bcrypt.compare(password, userFound.password)

    if (!comparePassword) {
      return { token: '', message: 'Wrong credentials' }
    }
    const TOKEN = jwt.sign(
      { username: userFound.username, id: userFound.id },
      secretToken,
      {
        expiresIn: 60 * 60
      }
    )
    return {
      token: TOKEN,
      message: 'Successfully login'
    }
  } catch (e) {
    throw Error('Login error')
  }
}
export const register = async (data: dataBody): Promise<any> => {
  const { username, password } = data
  try {
    const usersRepository = AppDataSource.getRepository(Users)
    // Valid if user exists by username
    const existUser = await usersRepository.find({
      where: {
        username
      }
    })
    if (existUser === undefined || existUser.length === 0) {
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)
      const registerUser = new Users()
      registerUser.username = username
      registerUser.password = hashPassword
      return await usersRepository.save(registerUser)
    } else {
      return {
        token: '',
        message: 'Username already exists'
      }
    }
  } catch (e) {
    throw Error('Error register user')
  }
}
// Top ten users
export const topTen = async (): Promise<any> => {
  try {
    const usersRepository = AppDataSource.getRepository(Users)
    // Valid if user exists by username
    const existUser = await usersRepository.find({
      select: {
        username: true,
        victories: true
      },
      order: {
        victories: 'DESC'
      },
      take: 10
    })
    if (existUser === undefined || existUser.length === 0) {
      return {
        token: '',
        message: 'Not users for top ten'
      }
    } else {
      return existUser
    }
  } catch (e) {
    throw Error('Error get top-ten')
  }
}
// user stats
export const stats = async (locals: Record<string, any>): Promise<any> => {
  try {
    const usersRepository = AppDataSource.getRepository(Users)
    // Valid if user exists by username
    const existUser = await usersRepository.findOne({
      select: {
        username: true,
        victories: true,
        totalGames: true
      },
      where: {
        username: locals.username
      }
    })
    if (existUser === null) {
      return {
        token: '',
        message: 'User stats not found'
      }
    } else {
      return existUser
    }
  } catch (e) {
    throw Error('Error get user stats')
  }
}

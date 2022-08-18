/* eslint-disable  @typescript-eslint/restrict-plus-operands */
import { MoreThan } from 'typeorm'
import { AppDataSource } from '../../db/db'
import { Words } from '../words/entity'
import { getActiveGame } from '../../utils/gameConfig'
import { Games } from './entity'
interface reqBody {
  user_word: string
}
interface resData {
  letter: string
  value: number
}
interface resError {
  message: string
}
// Game
export const gameWord = async (data: reqBody, locals: Record<string, any>): Promise<resData[] | resError | any> => {
  try {
    const { userId } = locals
    const gameActive = await getActiveGame(userId)
    if (gameActive.attempts >= 5) {
      return {
        message: '5 attempts limit reached, new words released every 5 minutes, come back later'
      }
    }
    const win: boolean = gameActive.win
    if (win) {
      return {
        message: `Word: ${String(gameActive.words.word)} guessed in attempt: ${String(gameActive.attempts)}, new words released every 5 minutes, come back later`
      }
    }
    const resultData = await compareWords(data.user_word, gameActive.words.word)
    const gameRepository = AppDataSource.getRepository(Games)
    gameActive.attempts += 1
    if (data.user_word === gameActive.words.word) {
      gameActive.win = true
      gameActive.users.victories += 1
      gameActive.words.totalHits += 1
    }
    await gameRepository.save(gameActive)
    return resultData
  } catch (e) {
    throw Error('Error playing game')
  }
}
// Top words
export const topWords = async (): Promise<any> => {
  try {
    const wordsRepository = AppDataSource.getRepository(Words)
    // Valid if user exists by username
    const topHitWords = await wordsRepository.find({
      select: {
        word: true,
        totalHits: true,
        totalPlayed: true
      },
      order: {
        totalHits: 'DESC'
      },
      where: {
        totalHits: MoreThan(0)
      }
    })
    if (topHitWords === undefined || topHitWords.length === 0) {
      return {
        message: 'No words found yet'
      }
    } else {
      return topHitWords
    }
  } catch (e) {
    throw Error('Error get top hit words')
  }
}

const compareWords = async (word1: string, word2: string): Promise<resData[]> => {
  const arrWord1 = [...word1]
  const arrWord2 = [...word2]
  return arrWord1.map((letter, i) => {
    if (letter === arrWord2[i]) {
      return {
        letter,
        value: 1
      }
    } else if (arrWord2.includes(letter)) {
      return {
        letter,
        value: 2
      }
    } else {
      return {
        letter,
        value: 3
      }
    }
  })
}

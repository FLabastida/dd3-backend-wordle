import axios, { AxiosResponse } from 'axios'
import { AppDataSource } from '../db/db'
import { Words } from '../api/words/entity'
import { Games } from '../api/game/entity'
import { Users } from '../api/users/entity'

export const resetGames = async (): Promise<Function> => {
  return async () => {
    try {
      await setCurrentWord()
      await resetActiveGames()
    } catch (e) {
      console.error(e)
    }
  }
}
export const startGame = async (): Promise<void> => {
  try {
    const reqData = await getWords()
    const filter = filterWords(reqData.data)
    const normalizedWords = normalizeWords(filter)
    await resetActiveGames()
    await saveWordsDB(normalizedWords)
    await setCurrentWord()
  } catch (e) {
    throw new Error('Error starting game')
  }
}
const getWords = async (): Promise<AxiosResponse> => {
  try {
    const data = await axios.get('https://gitlab.com/d2945/words/-/raw/main/words.txt')
    return data
  } catch (e) {
    throw new Error('Error get words')
  }
}
const filterWords = (wordsTxt: string): string[] => {
  const words = wordsTxt.split('\n')
  return words.filter((word: string) => {
    return word.length === 5
  })
}
const normalizeWords = (words: string[]): string[] => {
  const mapWords = words.map((word) => {
    return removeAccents(word.toLocaleUpperCase())
  })
  return [...new Set(mapWords)]
}
const removeAccents = (word: string): string => {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
const saveWordsDB = async (words: string[]): Promise<unknown> => {
  return words.map(async (word: string) => {
    // Valid if word already exists in DB
    const wordsRepository = AppDataSource.getRepository(Words)
    const wordAlreadyInDb = await wordsRepository.findOneBy({ word: word })
    // Only write new words
    if (wordAlreadyInDb === null) {
      // Save in DB
      const saveWord = new Words()
      saveWord.word = word
      await wordsRepository.save(saveWord)
    }
  })
}
const setCurrentWord = async (): Promise<void> => {
  try {
    const wordsRepository = AppDataSource.getRepository(Words)
    const currentWord = await wordsRepository.findBy({ isActive: true })
    if (currentWord.length === 0) {
      await updateActiveWord()
    } else if (currentWord.length > 0) {
      await updateActiveWord()
      for (const word of currentWord) {
        word.isActive = false
        await wordsRepository.save(word)
      }
      // Error if no currentWord
    } else {
      throw new Error('Error setting current word')
    }
  } catch (e) {
    console.error(e)
  }
}
const updateActiveWord = async (): Promise<void> => {
  const wordsRepository = AppDataSource.getRepository(Words)
  const matchWords = await wordsRepository.findBy({ isActive: false })
  const randomId = Math.floor(Math.random() * (matchWords.length - 1))
  const wordToUpdate = matchWords[randomId]
  wordToUpdate.isActive = true
  wordToUpdate.totalPlayed += 1
  await wordsRepository.save(wordToUpdate)
}
const resetActiveGames = async (): Promise<void> => {
  try {
    const gamesRepository = AppDataSource.getRepository(Games)
    const activeGames = await gamesRepository.findBy({ isActive: true })
    if (activeGames.length > 0) {
      for (const activeGame of activeGames) {
        activeGame.isActive = false
        await gamesRepository.save(activeGame)
      }
    }
  } catch (e) {
    console.error(e)
  }
}
export const getActiveGame = async (userId: number): Promise<Games | number | string | any> => {
  try {
    // Look for activeGames for user
    const gamesRepository = AppDataSource.getRepository(Games)
    const activeGames = await gamesRepository.findOne({
      relations: {
        users: true,
        words: true
      },
      where: {
        isActive: true,
        users: {
          id: userId
        }
      }
    })
    // If not found active games, set newActiveGame()
    if (activeGames !== null) {
      return activeGames
    } else {
      return await newActiveGame(userId)
    }
  } catch (e) {
    throw new Error('Error get active game')
  }
}
export const newActiveGame = async (userId: number): Promise<Games> => {
  const gamesRepository = AppDataSource.getRepository(Games)
  const activeGames = await gamesRepository.findOne({
    relations: {
      users: true,
      words: true
    },
    where: {
      isActive: true,
      users: {
        id: userId
      }
    }
  })

  if (activeGames !== null) {
    return activeGames
  } else {
    const wordsRepository = AppDataSource.getRepository(Words)
    const currentWord = await wordsRepository.findOne({ where: { isActive: true } })
    const userRepository = AppDataSource.getRepository(Users)
    const currentUser = await userRepository.findOne({
      where: {
        id: userId
      }
    })
    const newGame = new Games()
    if (currentUser !== null && currentWord !== null) {
      currentUser.totalGames += 1
      newGame.isActive = true
      newGame.attempts = 0
      newGame.users = currentUser
      newGame.words = currentWord
    }
    return await gamesRepository.save(newGame)
  }
}

import 'dotenv/config'
import 'reflect-metadata'
import app from '../app'
import configSetup from '../config/appConfig'
import {
  resetGames,
  startGame
} from '../utils/gameConfig'
import { AppDataSource } from '../db/db'

const main = async (): Promise<void> => {
  try {
    await AppDataSource.initialize()
    app.set('port', configSetup.PORT)
    app.listen(app.get('port'), () => {
      console.info(`Server on http://localhost:${String(app.get('port'))}`)
    })
    await startGame()
    setInterval(await resetGames(), 300000)
  } catch (e) {
    console.error(e)
  }
}
main().then(() => console.info('Game successfully started')).catch(() => console.error('Error starting game'))

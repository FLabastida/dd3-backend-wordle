import { DataSource } from 'typeorm'
import configSetup from '../config/appConfig'
import { Words } from '../api/words/entity'
import { Games } from '../api/game/entity'
import { Users } from '../api/users/entity'
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configSetup.DB_HOST,
  port: parseInt(String(configSetup.DB_PORT)),
  username: configSetup.DB_USERNAME,
  password: configSetup.DB_PASSWORD,
  database: configSetup.DB_NAME,
  synchronize: true,
  entities: [Words, Games, Users]
})

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import router from './routes/index'
import { forbiddenURL, errorHandler } from './middleware/appHandlerErrors'
const app = express()

// middleware
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(errorHandler)

// routes
const defaultRoute: string = '/api'
app.use(`${defaultRoute}`, router)
app.use('/*', forbiddenURL)
export default app

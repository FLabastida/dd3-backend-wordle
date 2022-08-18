/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { topWords, gameWord } from '../game/controller'
import { verifyToken } from '../../middleware/authJWT'

const router = express.Router()
router.get('/top-words', verifyToken, topWords)
router.post('/word', verifyToken, gameWord)

export default router

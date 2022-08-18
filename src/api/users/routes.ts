/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  login,
  register,
  topTen,
  stats
} from '../users/controller'
import { verifyToken } from '../../middleware/authJWT'

const router = express.Router()
// Only register users can get stats
router.get('/top-ten', verifyToken, topTen)
// Get user stats by id, uses id in token
router.get('/stats', verifyToken, stats)
// Anyone can login or register
router.post('/login', login)
router.post('/', register)

export default router

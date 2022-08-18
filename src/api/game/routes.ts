/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { topWords, gameWord } from '../game/controller'
import { verifyToken } from '../../middleware/authJWT'
import { validateRequest } from '../../middleware/requestValidator'
import { check, header } from 'express-validator'
const router = express.Router()
router.get('/top-words', [
  header('x-access-token', 'Token need for access services')
    .notEmpty()
    .isJWT(),
  validateRequest,
  verifyToken
], topWords)
router.post('/word', [
  header('x-access-token', 'Token need for access services')
    .notEmpty()
    .isJWT(),
  check('user_word', 'Need word to play')
    .notEmpty()
    .trim()
    .toUpperCase()
    .isLength({ min: 5, max: 5 })
    .matches(/^[A-Z]+$/)
    .withMessage('Not special characters, only 5 letters word'),
  validateRequest,
  verifyToken
], gameWord)

export default router

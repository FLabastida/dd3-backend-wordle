/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import {
  login,
  register,
  topTen,
  stats
} from '../users/controller'
import { verifyToken } from '../../middleware/authJWT'
import { validateRequest } from '../../middleware/requestValidator'
import { check, header } from 'express-validator'

const router = express.Router()
// Only register users can get stats
router.get('/top-ten', [
  header('x-access-token', 'Token need for access services')
    .notEmpty()
    .isJWT(),
  validateRequest,
  verifyToken
], topTen)
// Get user stats by id, uses id in token
router.get('/stats', [
  header('x-access-token', 'Token need for access services')
    .notEmpty()
    .isJWT(),
  validateRequest,
  verifyToken
], stats)
// Anyone can login or register
router.post('/login', [
  check('username', 'Username needed')
    .trim()
    .toLowerCase()
    .notEmpty(),
  check('password', 'Password needed')
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  validateRequest
], login)
router.post('/',
  [
    check('username', 'Username needed')
      .trim()
      .toLowerCase()
      .notEmpty(),
    check('password', 'Password with min 8 length needed')
      .notEmpty()
      .trim()
      .isLength({ min: 8 }),
    validateRequest
  ],
  register)

export default router

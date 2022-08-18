import express from 'express'
import users from '../api/users/routes'
import game from '../api/game/routes'
const router = express.Router()
router.use('/users', users)
router.use('/game', game)
export default router

const express = require('express');
const {
    createGame,
    getGames,
    getGame,
    updateGame,
    deleteGame,
    getDataframes,
    createDataframe,
    createSession
} = require('../controllers/gameController')

const router = express.Router();

/** Games */
// GET all games
router.get('/', getGames)

// GET single game
router.get('/:id', getGame)

// POST new game
router.post('/', createGame);

// UPDATE game
router.patch('/:id', updateGame)

// DELETE game
router.delete('/:id', deleteGame)

/** Dataframes */
// GET all game dataframes
router.get('/:id/dataframes', getDataframes);

// POST a new dataframe
router.post('/:id/dataframes', createDataframe);

/** Sessions */
// POST a new game session
router.post('/:id/sessions', createSession)

module.exports = router;
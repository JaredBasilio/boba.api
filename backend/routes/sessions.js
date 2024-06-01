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
} = require('../controllers/sessionController')

const router = express.Router();

module.exports = router;
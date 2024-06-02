const express = require('express');
const {
    createAction,
    getActions
} = require('../controllers/sessionController')

const router = express.Router();

// POST a new action
router.post('/:id', createAction)

// GET all actions for session
router.get('/:id', getActions)

module.exports = router;
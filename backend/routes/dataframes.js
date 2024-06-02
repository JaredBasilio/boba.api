const express = require('express');
const {
    getDataframes,
    getDataframe,
    updateDataframe,
    deleteDataframe,
    getSessions,
    getActions
} = require('../controllers/dataframeController')

const router = express.Router();

// GET all dataframes
router.get('/', getDataframes);

// GET single dataframe
router.get('/:id', getDataframe);

// DELETE dataframe
router.delete('/:id', deleteDataframe);

// UPDATE dataframe
router.patch('/:id', updateDataframe);

// GET all sessions
router.get('/:id/sessions', getSessions);

// GET all actions
router.get('/:id/actions', getActions);

module.exports = router;


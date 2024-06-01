const Game = require('../models/gameModel')
const Dataframe = require('../models/dataframeModel')
const Session = require('../models/sessionModel')
const Action = require('../models/actionModel')
const mongoose = require('mongoose');
const uuid = require('uuid');

/** Games */
// get all games
const getGames = async (req, res) => {
    const games = await Game.find({}).sort({createdAt: -1});

    res.status(200).json(games);
}

// get a single game
const getGame = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no game found'});
    }
    
    const game = await Game.findById(id)

    if (!game) {
        return res.status(404).json({error: 'no game found'});
    }

    res.status(200).json(game);
}

// create a game
const createGame = async (req, res) => {
    const {name, author, description} = req.body;

    // add doc to db
    try {
        const existingGame = await Game.findOne({ name });
        if (existingGame) {
            return res.status(400).json({ error: 'Game with this name already exists.' });
        }

        // creates an access_key for game modifications
        const access_key = uuid.v4();

        const game = await Game.create({
            name,
            author,
            description,
            access_key
        })
        res.status(200).json(game);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// delete a game
const deleteGame = async (req, res) => {
    const { id } = req.params;
    const { access_key } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no game found'});
    }

    if (!mongoose.Types.UUID.isValid(access_key)) {
        return res.status(404).json({error: 'incorrect access key'});
    }

    // game update validation
    const game = await Game.findById(id)
    if (!game) {
        return res.status(400).json({error: 'no game found'});
    }

    if (game.access_key != access_key) {
        return res.status(400).json({error: 'incorrect access key'});
    }

    const deletedGame = await Game.findOneAndDelete({_id: id});
    // TODO: delete all dataframes with game id

    // TODO: delete all sessions with deleted dataframes

    res.status(200).json(deletedGame);
}

// update a game
const updateGame = async (req, res) => {
    const { id } = req.params;
    const { access_key } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no game found'});
    }

    if (!mongoose.Types.UUID.isValid(access_key)) {
        return res.status(404).json({error: 'incorrect access key'});
    }

    // game update validation
    const game = await Game.findById(id)
    if (!game) {
        return res.status(400).json({error: 'no game found'});
    }

    if (game.access_key != access_key) {
        return res.status(400).json({error: 'incorrect access key'});
    }

    const updatedGame = await Game.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    res.status(200).json(updatedGame);
}

/** Dataframes */
// get all game dataframes
const getDataframes = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no dataframes found'});
    }

    const dataframes = await Dataframe.find({}).sort({createdAt: -1})

    res.status(200).json(dataframes);
}

// create a dataframe
const createDataframe = async (req, res) => {
    const { access_key, schema, name, description, author } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no game found'});
    }

    if (!mongoose.Types.UUID.isValid(access_key)) {
        return res.status(404).json({error: 'incorrect access key'});
    }

    // game update validation
    const game = await Game.findById(id)
    if (!game) {
        return res.status(400).json({error: 'no game found'});
    }

    if (game.access_key != access_key) {
        return res.status(400).json({error: 'incorrect access key'});
    }

    // add doc to db
    try {
        const existingDataframe = await Dataframe.findOne({ name });
        if (existingDataframe) {
            return res.status(400).json({ error: 'Dataframe with this name already exists.' });
        }

        const dataframe = await Dataframe.create({
            name,
            author,
            description,
            schema,
            "game_id": id
        })
        res.status(200).json(dataframe);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

/** Sessions */
// create session
const createSession = async (req, res) => {
    const { dataframe_id, player, access_key } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no game found'});
    }

    if (!mongoose.Types.UUID.isValid(access_key)) {
        return res.status(404).json({error: 'incorrect access key'});
    }

    // game update validation
    const game = await Game.findById(id)
    if (!game) {
        return res.status(400).json({error: 'no game found'});
    }

    if (game.access_key != access_key) {
        return res.status(400).json({error: 'incorrect access key'});
    }

    // add doc to db
    try {
        const session = await Session.create({
            player,
            dataframe_id
        })

        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    createGame,
    getGames,
    getGame,
    deleteGame,
    updateGame,
    getDataframes,
    createDataframe,
    createSession
}
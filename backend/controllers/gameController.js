const Game = require('../models/gameModel')
const Dataframe = require('../models/dataframeModel')
const Session = require('../models/sessionModel')
const Action = require('../models/actionModel')
const mongoose = require('mongoose');
const uuid = require('uuid');

/** Games */
// get all games
const getGames = async (req, res) => {
    const author =  req.query.author;
    let games;

    if (author !== undefined) {
        games = await Game.find({author: author}).sort({createdAt: -1});
    } else {
        games = await Game.find().sort({createdAt: -1});
    }

    const filteredGames = games.map(game => {
            const { access_key, ...rest } = game._doc;
            return rest;
        });

    res.status(200).json(filteredGames);
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

    const {access_key, ...rest} = game._doc;
    res.status(200).json(rest);
}

// check access key
const checkAccessKey = async (req, res) => {
    const { id } = req.params;
    const access_key =  req.query.access_key;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no game found'});
    }

    const game = await Game.findById(id)

    if (!game) {
        return res.status(404).json({error: 'no game found'});
    }
    
    res.status(200).json({
        hasAccess: game.access_key === access_key
    })
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

    const {original_access_key, ...rest} = await Game.findOneAndDelete({_id: id});

    // delete all dataframes, sessions, and actions
    const dataframes = await Dataframe.find({game_id: id});
    for (const dataframe of dataframes) {
        const { _id: dataframe_id } = dataframe;

        // delete the dataframe
        await Dataframe.findOneAndDelete({_id: dataframe_id});

        const sessions = await Session.find({ dataframe_id: dataframe_id});
        for (const session of sessions) {
            const { _id: session_id } = session;

            // delete the session
            await Session.findByIdAndDelete({_id: session_id});

            // delete the actions
            await Action.deleteMany({session_id: session_id});
        }
    }

    res.status(200).json(rest);
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

    const {original_access_key, ...rest} = await Game.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    res.status(200).json(rest);
}

/** Dataframes */
// get all game dataframes
const getDataframes = async (req, res) => {
    const { id } = req.params;
    const author =  req.query.author;
    let dataframes;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no dataframes found'});
    }

    if (author !== undefined) {
        dataframes = await Dataframe.find({author: author}).sort({createdAt: -1})
    } else {
        dataframes = await Dataframe.find({}).sort({createdAt: -1})
    }

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
        const existingDataframe = await Dataframe.findOne({ name: name, game_id: id });
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
    const { dataframe_ids, player, access_key } = req.body;
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
        const sessions = []
        const id = new mongoose.Types.ObjectId();
        for (const dataframe_id of dataframe_ids) {
            const session = await Session.create({
                _id: id,
                player,
                dataframe_id
            })
            sessions.push(session);
        }

        res.status(200).json(sessions);
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
    createSession,
    checkAccessKey
}
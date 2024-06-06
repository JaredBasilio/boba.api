const Dataframe = require('../models/dataframeModel')
const Session = require('../models/sessionModel')
const Game = require('../models/gameModel');
const Action = require('../models/actionModel')
const mongoose = require('mongoose');

const deleteDataframe = async (req, res) => {
    const { id } = req.params;
    const { access_key } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no dataframe found'});
    }

    if (!mongoose.Types.UUID.isValid(access_key)) {
        return res.status(404).json({error: 'incorrect access key'});
    }

    // finding game
    const dataframe = await Dataframe.findById(id);
    if (!dataframe) {
        return res.status(400).json({error: 'no dataframe found'});
    }
    const game_id = dataframe.game_id;
    const game = await Game.findById(game_id);
    if (!game) {
        return res.status(400).json({error: 'no game found'});
    }

    if (game.access_key != access_key) {
        return res.status(400).json({error: 'incorrect access key'});
    }

    const deletedDataframe = await Dataframe.findOneAndDelete({_id: id});

    // Delete all sessions and actions with the dataframe
    const sessions = await Session.find({ dataframe_id: id });
    for (const session of sessions) {
        const { _id: session_id } = session;
        await Session.findOneAndDelete({ _id: session_id })
        await Action.deleteMany({ session_id: session_id })
    }

    res.status(200).json(deletedDataframe);
}

const getDataframes = async (req, res) => {
    const author =  req.query.author;
    let dataframes;
    if (author !== undefined) {
        dataframes = await Dataframe({author: author}).sort({ createdAt: -1 })
    } else {
        dataframes = await Dataframe({}).sort({ createdAt: -1 })
    }

    res.status(200).json(dataframes);
}

const getDataframe = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no dataframe found'});
    }

    const dataframe = await Dataframe.findById(id);

    if (!dataframe) {
        return res.status(404).json({error: 'no dataframe found'});
    }

    res.status(200).json(dataframe);
}

const updateDataframe = async (req, res) => {
    const { id } = req.params;
    const { access_key, name, author, description, schema } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no dataframe found'});
    }

    if (!mongoose.Types.UUID.isValid(access_key)) {
        return res.status(404).json({error: 'incorrect access key'});
    }

    // finding game
    const dataframe = await Dataframe.findById(id);
    if (!dataframe) {
        return res.status(400).json({error: 'no dataframe found'});
    }
    const game_id = dataframe.game_id;
    const game = await Game.findById(game_id);
    if (!game) {
        return res.status(400).json({error: 'no game found'});
    }

    if (game.access_key != access_key) {
        return res.status(400).json({error: 'incorrect access key'});
    }


    const updatedDataframe = await Dataframe.findOneAndUpdate({_id: id}, {
        name,
        description,
        author,
        schema
    });

    res.status(200).json(updatedDataframe);
}

const getSessions = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no dataframe found'});
    }

    const sessions = await Session.find({ dataframe_id: id });

    res.status(200).json(sessions);
}

const getActions = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no dataframe found'});
    }

    const sessions = await Session.find({dataframe_id: id});

    const sessions_out = [];

    for (const session of sessions) {
        const { _id } = session;
        const actions = await Action.find({ session_id: _id });
        sessions_out.push(...actions);
    }

    res.status(200).json(sessions_out);
}

module.exports = {
    deleteDataframe,
    getDataframe,
    getDataframes,
    updateDataframe,
    getSessions,
    getActions
}
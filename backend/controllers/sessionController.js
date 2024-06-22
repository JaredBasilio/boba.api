const Dataframe = require('../models/dataframeModel')
const Session = require('../models/sessionModel')
const Game = require('../models/gameModel');
const Action = require('../models/actionModel')
const mongoose = require('mongoose');

/** Actions */
const createAction = async (req, res) => {
    const { id } = req.params;
    const { access_key, action, dataframe_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no session found'});
    }

    if (!mongoose.Types.ObjectId.isValid(dataframe_id)) {
        return res.status(404).json({error: 'no dataframe found'});
    }

    if (!mongoose.Types.UUID.isValid(access_key)) {
        return res.status(404).json({error: 'incorrect access key'});
    }

    const dataframe = await Dataframe.findById({_id: dataframe_id});
    const { game_id } = dataframe;
    
    const game = await Game.findById({_id: game_id});
    if (!game) {
        return res.status(404).json({error: 'no game found'});
    }
    if (game.access_key != access_key) {
        return res.status(404).json({error: 'incorrect access key'});
    }

    try {
        const createdAction = Action.create({
            dataframe_id,
            session_id: id,
            action,
        })
        res.status(200).json(createdAction);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const getActions = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no session found'});
    }

    const actions = await Action.find({session_id: id}).populate('session_id');;

    // JOIN THE SESSION HERE

    res.status(200).json(actions);
}

module.exports = {
    createAction,
    getActions
}
const Dataframe = require('../models/dataframeModel')
const Session = require('../models/sessionModel')
const mongoose = require('mongoose');

const deleteDataframe = async (req, res) => {
    // TODO
}

const getDataframes = async (req, res) => {
    // TODO
}

const getDataframe = async (req, res) => {
    // TODO
}

const updateDataframe = async (req, res) => {
    // TODO
}

const getSessions = async (req, res) => {
    const { id } = req.params;

    const sessions = await Session.find({ dataframe_id: id });

    res.status(200).json(sessions);
}

module.exports = {
    deleteDataframe,
    getDataframe,
    getDataframes,
    updateDataframe,
    getSessions
}
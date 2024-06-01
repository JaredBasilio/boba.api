const mongoose = require('mongoose');

const Schema = mongoose.Schema

const gameSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    access_key: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Game', gameSchema);
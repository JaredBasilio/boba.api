const mongoose = require('mongoose');

const Schema = mongoose.Schema

const sessionSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    player: {
        type: String,
        required: true
    },
    dataframe_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ip_address: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Session', sessionSchema);
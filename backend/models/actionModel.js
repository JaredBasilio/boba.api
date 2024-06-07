const mongoose = require('mongoose');

const Schema = mongoose.Schema

const actionSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    dataframe_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    action: {
        type: Object,
        requires: true
    }
}, { timestamps: true })
module.exports = mongoose.model('Action', actionSchema);
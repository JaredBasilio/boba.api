const mongoose = require('mongoose');

const Schema = mongoose.Schema

const dataframeSchema = new Schema({
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
    schema: {
        type: mongoose.Schema.Types.Array,
        requires: true
    },
    game_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.model('Dataframe', dataframeSchema);
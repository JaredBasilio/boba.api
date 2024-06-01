const mongoose = require('mongoose');

/** Actions */
const createAction = async (req, res) => {
    const { id } = req.params;
    const { access_key, action, dataframe_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'no session found'});
    }

    // Find Game given session
    
}

module.exports = {
    createAction
}
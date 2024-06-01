require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const games = require('./routes/games');
const dataframes = require('./routes/dataframes');
const actions = require('./routes/actions');

const app = express();

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/games', games);
// app.use('/api/dataframes', dataframes);
app.use('/api/actions', actions);

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log(`connected to db listening on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error);
    });
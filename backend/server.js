require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const games = require('./routes/games');
const dataframes = require('./routes/dataframes');
const sessions = require('./routes/sessions');

const app = express();

// middleware
app.use(express.json())
app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/games', games);
app.use('/api/dataframes', dataframes);
app.use('/api/sessions', sessions)


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
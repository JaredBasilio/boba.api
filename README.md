# 🤖 BOBA.API
## 📖 Introduction
BOBA.API is a project to better streamline the data collection process in the Operational and Behavioral Analytics Lab at UC Berkeley. Since the research group has a lot of communication through the discord and 
to ease new user onboarding, a discord bot was used as a user interface for all internal actions such as game metadata management and dataframe metadata management.

A typical end to end process for game and data retrieval would look something like this.
1. Create Game through discord
2. Create Dataframe through discord
3. Implement to Game using your frontend framework
4. Start Playing
5. Get all actions for a dataframe through discord

Feel free to raise any issues or improvements that could potentially be implemented into the project by messaging Jared through discord.

## 🗂️ Table of Contents
 - [Introduction](#introduction)
 - [How to implement sessions](#implement-sessions)
 - [How to implement actions](#implement-actions)
 - [Features and Commands](#features-and-commands)

## 🤝 How to implement sessions.
Each game should prompt users to input their name/id for future references. This is where ultimately our session will start. Using the below script written in javascript will prompt the start of the session. 
The session id (returned as as the _id variable) should be stored somewhere in your project globally to be used as a reference when making actions.
```javascript
const game_id = YOUR_GAME_ID;
const dataframe_ids = ARRAY_OF_DATAFRAME;
const access_key = ACCESS_KEY_FOR_GAME;
const player = PLAYER_OF_SESSION;
try {
  const response = await fetch(`https://bobaapi.up.railway.app/api/games/${game_id}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dataframe_ids
      player
      access_key
    })})
  const sessions = await response.json();
  const { _id } = sessions[0];
  // Save the _id somewhere that can be accessed throughout the game.
} catch (err) {
  console.log(err);
}
```

## 📍 How to log actions.
Given your session id, we can log actions for a game where appropriate. Using the below script will save an action by the user:
```javascript
try {
 const session_id = ... // Get the session_id from your global variable
 const access_key = ... // Access key for game
 const dataframe_id = ... // id for the dataframe you wishe to upload to
 const action = ... // obj that matches the schema when creating the dataframe
 const response = await fetch(`https://bobaapi.up.railway.app/api/sessions/${session_id}`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   access_key,
   action,
   dataframe_id,
  })
 });
 
 const responseJson = await response.json()
 console.log(`Logged Action: ${JSON.stringify(responseJson)}`)
} catch (err) {
 console.log(err);
}
```

## ✏️ Features and Commands
* /game create
  * Creates a game that can be used to make dataframes and sessions. A modal will appear prompting to input the name of the game and the optional description of the game. Returned is the `access_key` for the game. Only those with this `access_key` can make any modificiations to the game/dataframes and creating sessions/actions for the game.
* /game get `game_id`
  * Gets a game given the `game_id`
* /game get-all
  * Gets all games made in BOBALab
* /game get-author `author`
  * Gets all the games made by the `user_id`. `user_id` has an autofill for all users in the server but if the user has left must be obtained manually.
* /game create-dataframe `game_id` `access_key`
  * Creates a dataframe for the given `game_id`. An `access_key` is required to ensure no bad actors when making dataframes. You are promptin with a modal asking for the name and description. No `access_key` is needed for individual dataframes.
* /dataframe actions `dataframe_id`
  * Gets all the actions made for the dataframe.
* /dataframe get-all `game-id`
  * Gets all dataframes for the `game-id`.
* /dataframe get-author `author`
  * Gets all the dataframes made by the author `author`.
* /dataframes sessions `dataframe-id`
  * Gets all the sessions of the dataframe `dataframe-id`

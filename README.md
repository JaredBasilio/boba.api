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
 - [Introduction]
 - [How to implement sessions]
 - [How to implememnt actions]
 - [Features and Commands]

## How to implement sessions.
Each game should prompt users to input their name/id for future references. This is where ultimately our session will start. Using the below script written in javascript will prompt the start of the session. 
The session id (returned as as the _id variable) should be stored somewhere in your project globally to be used as a reference when making actions.
```
const game_id = YOUR_GAME_ID;
const dataframe_ids = ARRAY_OF_DATAFRAME;
const access_key = ACCESS_KEY_FOR_GAME;
const player = PLAYER_OF_SESSION;
try {
  const response = await fetch(`http://localhost:4000/api/games/${game_id}/sessions`, {
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
  const { _id } = sessions;
  // Save the _id somewhere that can be accessed throughout the game.
} catch (err) {
  console.log(err);
}
```

## How to log actions.
Given your session id, we can log actions for a game where appropriate. Using the below script will save an action by the user

## Features and Commands
* /game create
* /game get game_id
* /game get-all
* /game get-user user_id
* /game create-dataframe game_id access_key

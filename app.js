const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let db = null;

const dbPath = path.join(__dirname, "cricketMatchDetails.db");

const initilizeDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Is Running at Ramesh http://localhost:3000/");
    });
  } catch (er) {
    console.log(`Db Error Is ${er.message}`);
    process.exit(1);
  }
};

initilizeDb();

//GET Player API

const getCamelp = (each) => {
  return {
    playerId: each.player_id,
    playerName: each.player_name,
  };
};
app.get(" /players/", async (request, response) => {
  const getquary = `
    SELECT 
    * 
    FROM 
    player_details
    ORDER BY 
      player_id;
    `;
  const result = await db.all(getquary);
  const final = [];
  for (let each of result) {
    let one = getCamelp(each);
    final.push(one);
    console.log(one);
  }
  response.send(final);
});

//GET SPECIFIC PLAYER
app.get(" /players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getplayer = ` 
    SELECT 
    * 
    FROM 
    player_details
    WHERE player_id=${playerId};
    `;
  const result = await db.get(getplayer);
  const final_result = getCamelp(result[0]);
  response.send(final_result);
});

//ubdate Player API

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName } = request.body;
  const quary = ` 
          UPDATE 
           player_details
           SET 
            player_name='${playerName}'
            WHERE player_id=${playerId};
           `;
  await db.run(quary);
  response.send("Player Details Updated");
});

// GET MATCH DETAILS
const getMatchCamel = (match) => {
  return {
    matchId: match.match_id,
    match: match.match,
    year: year,
  };
};
app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const getmatchuary = ` 
         SELECT 
         * 
         FROM 
         match_details
         WHERE match_id=${matchId};
    `;
  const result = await db.run(getmatchuary);
  const final = getMatchCamel(result[0]);
  response.send(final);
});

//
module.exports = app;

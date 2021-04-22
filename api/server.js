const express = require('express');
const app = express();
const csvparser = require('csv-parser');
const cors = require('cors');
const fs = require('fs');
const drafted = require('./drafted')
const prospects = require('./prospects')
const score = require('./score')
const csv = './data.csv';

const port = 3001;
const BASE = '/api';

app.use(cors());
app.use(express.json());

const picks = [];

function getPicks() {
  fs.createReadStream(csv)
  .pipe(csvparser())
  .on('data', (row) => {
    picks.push(row);
  });
}

getPicks();

function leaderBoard(drafted, picks) {
  const scores = picks.map(score.get.bind(this, drafted));
  return scores.sort((a, b) => (a.score > b.score) ? 1 : -1)
}

function filterDrafted(drafted, el) {
  return !drafted.includes(el.name)
}

app.get(BASE + '/prospects', (req, res) => {
  const drafted_players = drafted.get()
  const un_drafted = prospects.get().filter(filterDrafted.bind(this, drafted_players));
  res.send({
    prospects: un_drafted,
    drafted: drafted_players,
    leaderBoard: leaderBoard(drafted, picks),
    picks: picks,
  });
});

app.post(BASE + '/selected', (req, res) => {
  const received = req.body;
  const value = received && received.value;

  if (!value) {
    res.status(400);
    res.send({ message: 'must pass a value '});
  }

  const drafted_players = drafted.add(value)
  const un_drafted = prospects.get().filter(filterDrafted.bind(this, drafted_players));
  res.send({ 
    received,
    prospects: un_drafted, 
    drafted: drafted_players,
    leaderBoard: leaderBoard(drafted.data, picks),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
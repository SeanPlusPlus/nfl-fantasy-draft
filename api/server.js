const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const port = 3001;
const BASE = '/api';

app.use(cors());
app.use(express.json());

const drafted = new Set();

function getScore(drafted, el) {
  return {
    name: el,
    score: Math.floor(Math.random() * 1000)
  }
}

function leaderBoard(drafted) {
  const names = [
    'Sean S.',
    'Ryan',
    'Sean R.',
    'Lucas',
    'Ben',
    'Chris',
  ]
  const scores = names.map(getScore.bind(this, drafted));
  return scores.sort((a, b) => (a.score > b.score) ? 1 : -1)
}

function filterDrafted(drafted, el) {
  return !Array.from(drafted).includes(el.name)
}

app.get(BASE + '/prospects', (req, res) => {
  const rawdata = fs.readFileSync('prospects.json');
  const prospects = JSON.parse(rawdata).data.filter(filterDrafted.bind(this, drafted));
  res.send({
    prospects,
    drafted: Array.from(drafted),
    leaderBoard: leaderBoard(drafted)
  });
});

app.post(BASE + '/selected', (req, res) => {
  const received = req.body;
  const value = received && received.value;

  if (!value) {
    res.status(400);
    res.send({ message: 'must pass a value '});
  }

  drafted.add(received.value)
  const rawdata = fs.readFileSync('prospects.json');
  const prospects = JSON.parse(rawdata).data.filter(filterDrafted.bind(this, drafted));
  res.send({ 
    received,
    prospects, 
    drafted: Array.from(drafted),
    leaderBoard: leaderBoard(drafted)
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
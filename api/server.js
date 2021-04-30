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
const BASE = '/api/';

app.use(cors());
app.use(express.json());

const entries = []

function getEntries() {
  fs.createReadStream(csv)
  .pipe(csvparser())
  .on('data', (row) => {
    const list = [];
    for (var i = 0; i < 32; i++) {
      const pick_number = `#${(i + 1)}`
      list.push(row[pick_number].split(' - ')[0])
    }
    const entry = {
      name: row['Name'],
      team: row['Team'],
      email: row['Email Address'],
      list: list,
    }
    entries.push(entry);
  });
}

getEntries();

function leaderBoard(drafted, picks) {
  const scores = picks.map(score.get.bind(this, drafted));
  const sorted = scores.sort((a, b) => (a.score > b.score) ? 1 : -1)
  return score.rank(sorted)
}

function filterDrafted(drafted, el) {
  return !drafted.includes(el.name)
}

app.get(BASE, (req, res) => {
  const drafted_players = drafted.get()
  const un_drafted = prospects.get().filter(filterDrafted.bind(this, drafted_players));
  const ranked = leaderBoard(drafted_players, entries)

  const final = true
  if (final) {
    const rankings = getFinalRankings()
    ranked.forEach((entry) => {
      entry.score = rankings[entry.name]
    })
    ranked.sort((a, b) => (a.score > b.score) ? 1 : -1)
    ranked.forEach((score, idx) => {
      score.rank = idx + 1;
      const prev = ranked[idx - 1];
      if (prev && prev.score === score.score) {
        score.rank = prev.rank
      }
    });
  }

  res.send({
    prospects: un_drafted,
    drafted: drafted_players,
    leaderBoard: ranked 
  });
});

app.post(BASE, (req, res) => {
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
    leaderBoard: leaderBoard(drafted_players, entries),
  });
});


function getFinalRankings () {
  const drafted_players = drafted.get()
  const final = entries.map((entry) => {
    const points = score.get(drafted_players, entry).score
    const penalty =  score.penalty(drafted_players, entry)
    const total = points + penalty
    return {
      name: entry.name,
      total: total,
      points: points,
      penalty: penalty,
    }

  }) 
  const ranked = {}
  const sorted = final.sort((a, b) => (a.total > b.total) ? 1 : -1)
  sorted.forEach((entry) => {
    ranked[entry.name] = entry.total
  })
  return ranked
}

app.get(BASE + 'final', (req, res) => {
  res.send(getFinalRankings());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
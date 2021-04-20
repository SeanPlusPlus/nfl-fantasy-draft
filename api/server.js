const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const port = 3001;
const BASE = '/api';

app.use(cors());
app.use(express.json());

const drafted = new Set();

function filterDrafted(el) {
  return !Array.from(drafted).includes(el.name)
}

app.get(BASE + '/prospects', (req, res) => {
  const rawdata = fs.readFileSync('prospects.json');
  const prospects = JSON.parse(rawdata).data.filter(filterDrafted);
  res.send({
    prospects,
    drafted: Array.from(drafted),
  });
});

app.post(BASE + '/selected', (req, res) => {
  const received = req.body;
  drafted.add(received.value)
  const rawdata = fs.readFileSync('prospects.json');
  const prospects = JSON.parse(rawdata).data.filter(filterDrafted);
  res.send({ 
    received,
    prospects, 
    drafted: Array.from(drafted),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
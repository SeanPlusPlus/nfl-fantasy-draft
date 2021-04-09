const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');
const port = 3001
const BASE = '/api'

app.use(cors())

app.get(BASE + '/prospects', (req, res) => {
  const rawdata = fs.readFileSync('prospects.json');
  const prospects = JSON.parse(rawdata);
  res.send(prospects)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
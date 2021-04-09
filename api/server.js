const express = require('express')
const app = express()
const cors = require('cors')
const port = 3001

app.use(cors())

app.get('/', (req, res) => {
  res.send({ message: 'hello world' })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const fs = require('fs');
const path = 'prospects.json'

module.exports = {
  get: function () {
    const rawdata = fs.readFileSync(path);
    return JSON.parse(rawdata).data;
  }
}

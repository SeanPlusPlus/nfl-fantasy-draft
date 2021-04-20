const fs = require('fs');
const path = 'drafted.json'

module.exports = {
  get: function () {
    const rawdata = fs.readFileSync(path);
    return JSON.parse(rawdata).data;
  },

  add: function(name) {
    console.log('name', name);
    const rawdata = fs.readFileSync(path);
    const data = JSON.parse(rawdata).data
    data.push(name);
    const json = JSON.stringify({ data: data });
    fs.writeFileSync(path, json);
    return data;
  }
}

module.exports = {
  get: function(drafted, el) {
    console.log(drafted, el);
    
    return {
      name: el['Email Address'],
      score: Math.floor(Math.random() * 1000)
    }
  }
}

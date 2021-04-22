function getPickIdx(drafted_player, draft_list) {
  const idx = draft_list.indexOf(drafted_player);
  if (idx >= 0) {
    return idx
  }
  return 32
}
module.exports = {
  get: function(drafted, entry) {
    var score = 0;
    for (var i = 0; i < drafted.length; i++) {
      const player = drafted[i]
      const pick_index = getPickIdx(player, entry.list)
      const delta = Math.abs(i - pick_index)
      score += Math.pow(delta, 2)
      // console.log(player, pick_index, delta, score);
    }
    
    return {
      name: entry.email,
      score: score,
    }
  }
}

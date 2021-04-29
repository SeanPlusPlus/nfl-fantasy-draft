function getTeam(name) {
  return `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${name}.png&h=80&scale=crop&w=80&location=origin`
}

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
    }
    
    return {
      name: entry.name,
      team: getTeam(entry.team),
      email: entry.email,
      score: score,
    }
  },

  rank: function(scores) {
    scores.forEach((score, idx) => {
      score.rank = idx + 1;
      const prev = scores[idx - 1];
      if (prev && prev.score === score.score) {
        score.rank = prev.rank
      }
    });
    return scores;
  }
}

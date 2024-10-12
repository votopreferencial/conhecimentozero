function countSTVVotes(ballots, seats) {
  let candidates = [...new Set(ballots.flatMap(b => b))];
  let elected = [];
  let eliminated = [];
  let quota = Math.floor(ballots.length / (seats + 1)) + 1;

  while (elected.length < seats && candidates.length > 0) {
    let counts = candidates.reduce((acc, c) => ({...acc, [c]: 0}), {});
    
    ballots.forEach(ballot => {
      let vote = ballot.find(c => candidates.includes(c));
      if (vote) counts[vote]++;
    });

    let maxVotes = Math.max(...Object.values(counts));
    let winners = Object.keys(counts).filter(c => counts[c] >= quota);

    if (winners.length > 0) {
      winners.forEach(winner => {
        elected.push(winner);
        candidates = candidates.filter(c => c !== winner);
        let surplus = counts[winner] - quota;
        if (surplus > 0) {
          let weight = surplus / counts[winner];
          ballots = ballots.map(ballot => 
            ballot[0] === winner ? ballot.slice(1).map(c => [c, weight]) : ballot
          );
        }
      });
    } else {
      let loser = Object.keys(counts).reduce((a, b) => counts[a] < counts[b] ? a : b);
      eliminated.push(loser);
      candidates = candidates.filter(c => c !== loser);
      ballots = ballots.map(ballot => ballot.filter(c => c !== loser));
    }
  }

  return { elected, eliminated };
}

module.exports = { countSTVVotes };
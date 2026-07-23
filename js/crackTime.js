/* crackTime.js
   Converts effective entropy into a human-readable crack-time estimate.
*/

// Converts a number of seconds into a readable string, e.g.
// "3.2 years" or "instantly".
function formatDuration(seconds){
  if(!isFinite(seconds)) return "—";
  if(seconds < 1) return "instantly";
  const units = [
    ["century", 3153600000], ["year", 31536000], ["day", 86400],
    ["hour", 3600], ["minute", 60], ["second", 1]
  ];
  if(seconds > 3153600000 * 1e6) return "longer than the universe has existed";
  for(const [name, size] of units){
    if(seconds >= size){
      const val = seconds/size;
      const rounded = val >= 100 ? Math.round(val).toLocaleString() : val.toFixed(1);
      return `${rounded} ${name}${val>=2?'s':''}`;
    }
  }
  return "instantly";
}

// Models a realistic offline attack: a fast, poorly-chosen hash on
// modern GPU hardware, at ~10 billion guesses/second. On average an
// attacker needs to try half the keyspace before finding a match.
function estimateCrackTime(effBits){
  const guesses = Math.pow(2, effBits) / 2;
  const rate = 1e10;
  return formatDuration(guesses / rate);
}

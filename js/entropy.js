/* entropy.js
   Pool entropy and effective entropy calculations.
   Depends on: data.js (LEET_MAP)
*/

// Character-pool size based on which classes are present in the password.
function poolSize(pw){
  let n=0;
  if(/[a-z]/.test(pw)) n+=26;
  if(/[A-Z]/.test(pw)) n+=26;
  if(/[0-9]/.test(pw)) n+=10;
  if(/[^a-zA-Z0-9]/.test(pw)) n+=32;
  return n||1;
}

// Theoretical max entropy: length x log2(pool size).
function rawEntropy(pw){
  if(!pw) return 0;
  return pw.length * Math.log2(poolSize(pw));
}

// Converts leetspeak characters back to plain letters, e.g. "p@ssw0rd" -> "password".
function deLeet(pw){
  return pw.toLowerCase().split('').map(c=>LEET_MAP[c]||c).join('');
}

// Strips trailing digits, e.g. "password123" -> "password".
function stripTrailingDigits(s){ return s.replace(/\d+$/,''); }

// Effective entropy = raw entropy minus the sum of all detected
// pattern penalties (floored at 0). An exact leaked-password match
// caps effective entropy near 6 bits regardless of length.
function effectiveEntropy(pw, patterns){
  let e = rawEntropy(pw);
  const exact = patterns.find(p=>p.type==='exact-leak');
  if(exact) return Math.min(e, 6);
  for(const p of patterns) e -= p.penalty;
  return Math.max(e, 0);
}

// Maps effective entropy to a strength label, color, and how many
// of the 5 meter segments should be filled.
function strengthBand(effBits){
  if(effBits < 28) return {label:"very weak", color:"var(--danger)", segs:1};
  if(effBits < 40) return {label:"weak", color:"var(--danger)", segs:2};
  if(effBits < 60) return {label:"reasonable", color:"var(--amber)", segs:3};
  if(effBits < 80) return {label:"strong", color:"var(--success)", segs:4};
  return {label:"very strong", color:"var(--success)", segs:5};
}

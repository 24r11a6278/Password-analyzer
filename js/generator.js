/* generator.js
   Cryptographically secure password generation, used both by the
   standalone generator panel and the "suggest a replacement" feature.
*/

// Cryptographically secure random integer in [0, max), using the
// Web Crypto API rather than Math.random().
function secureRandomInt(max){
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

// Builds a random password from the selected character classes.
// Visually ambiguous characters (I, l, O, 0, 1) are excluded from
// the letter/digit pools to reduce transcription errors.
function generatePassword(len, upper, lower, digits, symbols){
  let charset = "";
  if(upper) charset += "ABCDEFGHJKLMNPQRSTUVWXYZ";
  if(lower) charset += "abcdefghijkmnpqrstuvwxyz";
  if(digits) charset += "23456789";
  if(symbols) charset += "!@#$%^&*()-_=+[]{}";
  if(!charset) return "";
  let out = "";
  for(let i=0;i<len;i++) out += charset[secureRandomInt(charset.length)];
  return out;
}

// Suggests a fresh, unrelated strong password rather than patching
// the user's existing weak one — attackers already try common
// mutations of leaked passwords, so "fixing" one doesn't help much.
function suggestPassword(pw){
  const len = Math.max(pw.length, 16);
  return generatePassword(len, true, true, true, true);
}

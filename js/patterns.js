/* patterns.js
   Detects weak patterns in a password: leaked-list matches,
   repeated characters, sequential runs, keyboard walks, and years.
   Depends on: data.js (COMMON_PASSWORDS, KEYBOARD_ROWS), entropy.js (deLeet, stripTrailingDigits)
*/

function detectPatterns(pw){
  const found = [];
  if(!pw) return found;
  const lower = pw.toLowerCase();
  const leet = deLeet(pw);
  const leetStripped = stripTrailingDigits(leet);

  // Exact / disguised match against the known-leaked list
  if(COMMON_PASSWORDS.has(lower)){
    found.push({type:'exact-leak', label:'matches known leaked password', penalty:1000});
  } else if(COMMON_PASSWORDS.has(leetStripped) || COMMON_PASSWORDS.has(leet)){
    found.push({type:'leet-leak', label:'common password with substitutions', penalty:40});
  }

  // Repeated characters, e.g. "aaa"
  if(/(.)\1{2,}/.test(pw)){
    found.push({type:'repeat', label:'repeated characters', penalty:12});
  }

  // Sequential runs of 4+ characters, ascending or descending
  // (letters or digits), e.g. "abcd" or "4321"
  const seqSrc = "abcdefghijklmnopqrstuvwxyz0123456789";
  for(let i=0;i<=lower.length-4;i++){
    const chunk = lower.slice(i,i+4);
    const idxFwd = seqSrc.indexOf(chunk[0]);
    if(idxFwd!==-1 && seqSrc.slice(idxFwd,idxFwd+4)===chunk){
      found.push({type:'sequential', label:'sequential run: '+chunk, penalty:15});
      break;
    }
    const rev = chunk.split('').reverse().join('');
    const idxRev = seqSrc.indexOf(rev[0]);
    if(idxRev!==-1 && seqSrc.slice(idxRev,idxRev+4)===rev){
      found.push({type:'sequential', label:'sequential run: '+chunk, penalty:15});
      break;
    }
  }

  // Keyboard-walk patterns, e.g. "qwer" or "asdf"
  for(const row of KEYBOARD_ROWS){
    for(let i=0;i<=row.length-4;i++){
      const chunk = row.slice(i,i+4);
      if(lower.includes(chunk)){
        found.push({type:'keyboard', label:'keyboard-walk pattern', penalty:18});
        break;
      }
    }
  }

  // Contains a plausible year, e.g. "1998" or "2024"
  if(/(19|20)\d{2}/.test(pw)){
    found.push({type:'date', label:'contains a year', penalty:8});
  }

  // De-duplicate by pattern type so one password isn't penalized
  // twice for the same issue.
  const seen = new Set();
  return found.filter(f=>{ if(seen.has(f.type)) return false; seen.add(f.type); return true; });
}

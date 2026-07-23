/* main.js
   Connects the analysis/generator logic to the UI and keeps it live-updating.
   Depends on: entropy.js, patterns.js, crackTime.js, generator.js (loaded before this file)
*/

const input = document.getElementById('pw-input');
const segmentsEl = document.getElementById('segments');
for(let i=0;i<5;i++){
  const s = document.createElement('div'); s.className='seg'; segmentsEl.appendChild(s);
}

function render(){
  const pw = input.value;
  document.getElementById('len-count').textContent = pw.length + " chars";

  const patterns = detectPatterns(pw);
  const raw = rawEntropy(pw);
  const eff = effectiveEntropy(pw, patterns);

  document.getElementById('entropy-val').textContent = raw.toFixed(1) + " bits";
  document.getElementById('eff-val').textContent = eff.toFixed(1) + " bits";

  const leaked = patterns.some(p=>p.type==='exact-leak');
  const leakEl = document.getElementById('leak-val');
  const leakSub = document.getElementById('leak-sub');
  if(!pw){
    leakEl.textContent = "—"; leakEl.style.color = "var(--ink)";
    leakSub.textContent = "checked against known list";
  } else if(leaked){
    leakEl.textContent = "FOUND"; leakEl.style.color = "var(--danger)";
    leakSub.textContent = "in known leaked list — do not use";
  } else {
    leakEl.textContent = "clear"; leakEl.style.color = "var(--success)";
    leakSub.textContent = "not in this demo's list";
  }

  const band = pw ? strengthBand(eff) : {label:"—", color:"var(--muted)", segs:0};
  const segEls = segmentsEl.children;
  for(let i=0;i<5;i++){
    segEls[i].style.background = i < band.segs ? band.color : "var(--line)";
  }
  const labelEl = document.getElementById('strength-label');
  labelEl.textContent = band.label;
  labelEl.style.color = band.color;

  document.getElementById('crack-val').textContent = pw ? estimateCrackTime(eff) : "—";

  const tagsEl = document.getElementById('pattern-tags');
  tagsEl.innerHTML = "";
  if(!pw){
    tagsEl.innerHTML = '<span class="tag clean">type something above</span>';
  } else if(patterns.length === 0){
    tagsEl.innerHTML = '<span class="tag clean">no obvious patterns detected</span>';
  } else {
    patterns.forEach(p=>{
      const t = document.createElement('span');
      t.className = 'tag'; t.textContent = p.label;
      tagsEl.appendChild(t);
    });
  }

  const suggestPanel = document.getElementById('suggest-panel');
  if(pw && eff < 60){
    suggestPanel.style.display = 'block';
    document.getElementById('suggest-text').textContent =
      leaked ? "This password is known to attackers. Here's a fresh, unrelated password instead:"
             : "This could be stronger. Here's a randomly generated alternative:";
    document.getElementById('suggest-pw').textContent = suggestPassword(pw);
  } else {
    suggestPanel.style.display = 'none';
  }
}

input.addEventListener('input', render);
render();

// Show/hide password toggle
document.getElementById('toggle-visibility').addEventListener('click', (e)=>{
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  e.target.textContent = showing ? 'show' : 'hide';
});

// Copy-to-clipboard buttons (used by both suggestion and generator panels)
document.querySelectorAll('.copy-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = document.getElementById(btn.dataset.copyTarget);
    const text = target.textContent;
    if(!text || text==='—' || text==='click generate') return;
    navigator.clipboard.writeText(text);
    const old = btn.textContent;
    btn.textContent = 'copied';
    setTimeout(()=>btn.textContent = old, 1000);
  });
});

// Generator panel controls
const genLenSlider = document.getElementById('gen-length');
const genLenVal = document.getElementById('gen-length-val');
genLenSlider.addEventListener('input', ()=> genLenVal.textContent = genLenSlider.value);

document.getElementById('gen-btn').addEventListener('click', ()=>{
  const len = parseInt(genLenSlider.value, 10);
  const upper = document.getElementById('opt-upper').checked;
  const lower = document.getElementById('opt-lower').checked;
  const digits = document.getElementById('opt-digits').checked;
  const symbols = document.getElementById('opt-symbols').checked;
  const pw = generatePassword(len, upper, lower, digits, symbols);
  document.getElementById('gen-output').textContent = pw || "select at least one character type";
});

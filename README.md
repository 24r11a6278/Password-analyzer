# 🔐 Password Analyzer

A single-page, fully client-side tool that analyzes password strength the way a real attacker would — using entropy math, realistic crack-time modeling, pattern detection, and a leaked-password check. Also includes a cryptographically secure password generator.

**Live demo:** https://24r11a6278.github.io/Password-analyzer/PasswordAnalyzer.html

Runs entirely in the browser — no backend, no network requests, no analytics, works fully offline once downloaded.

---

## 📌 What It Does

As you type a password, the tool live-updates:

1. **Raw (pool) entropy** — theoretical max entropy based on character set size and length
2. **Effective entropy** — raw entropy minus penalties for detected weak patterns
3. **A 5-segment strength meter** (very weak → very strong)
4. **Leaked-password check** — flags exact matches against an embedded list of common breached passwords
5. **Detected pattern tags** — shows *why* a password is weak
6. **Estimated crack time** — human-readable duration (e.g. "3.2 years", "instantly")
7. **A suggested replacement password** — generated when effective entropy is below 60 bits
8. **A standalone secure password generator** — adjustable length and character-set toggles

---

## 🧠 How the Code Works

The logic is split into separate files, each handling one job:

### `js/data.js` — reference data
- `COMMON_PASSWORDS`: a `Set` of ~150 known leaked/weak passwords (RockYou-style)
- `KEYBOARD_ROWS`: real keyboard rows (`qwertyuiop`, `asdfghjkl`, etc.), used to catch keyboard-walk patterns
- `LEET_MAP`: substitution table (`@`→`a`, `0`→`o`, `3`→`e`, etc.) for de-leeting a password before checking it

### `js/entropy.js` — the entropy math
- `poolSize(pw)` — adds up character-class sizes present in the password (lowercase +26, uppercase +26, digits +10, symbols +32)
- `rawEntropy(pw)` — `length × log2(pool size)`, the theoretical max entropy
- `deLeet(pw)` / `stripTrailingDigits(s)` — normalizes leetspeak and trailing numbers so `p@ssw0rd123` can be matched back to `password`
- `effectiveEntropy(pw, patterns)` — raw entropy minus the penalty of every detected pattern (floored at 0; an exact leaked match caps it near 6 bits regardless of length)
- `strengthBand(effBits)` — maps the final entropy number to a label/color/meter-fill (very weak → very strong)

### `js/patterns.js` — pattern detection
One function, `detectPatterns(pw)`, that checks for:
| Pattern | Detection method | Penalty |
|---|---|---|
| Exact leaked password | Direct `Set` lookup | caps entropy ~6 bits |
| Leetspeak variant of a leaked password | De-leet + strip digits, re-check | −40 bits |
| Repeated characters (`aaa`) | Regex `/(.)\1{2,}/` | −12 bits |
| Sequential run (`abcd`, `4321`) | Substring check against an alphabet/digit string | −15 bits |
| Keyboard walk (`qwer`, `asdf`) | Substring check against `KEYBOARD_ROWS` | −18 bits |
| Contains a year (`1998`, `2024`) | Regex `/(19|20)\d{2}/` | −8 bits |

Results are de-duplicated so one password isn't penalized twice for the same issue.

### `js/crackTime.js` — turning entropy into a real number
- `estimateCrackTime(effBits)` — models `2^effBits ÷ 2 guesses`, divided by an assumed **10 billion guesses/second** (a realistic offline attacker with a stolen database and a fast, poorly-chosen hash on GPU hardware)
- `formatDuration(seconds)` — converts that raw number into something readable ("3.2 years", "instantly", "longer than the universe has existed")

### `js/generator.js` — secure password generation
- `secureRandomInt(max)` — uses `crypto.getRandomValues()` (the Web Crypto API), **not** `Math.random()`, since `Math.random` is not cryptographically secure
- `generatePassword(len, upper, lower, digits, symbols)` — builds a random password from the selected character classes
- `suggestPassword(pw)` — used when the typed password is weak; generates a completely fresh password rather than patching the old one, since attackers already try common mutations of leaked passwords

### `js/main.js` — DOM wiring
The only file that touches the page directly. Reads the password input on every keystroke, calls the functions above, and updates the strength meter, entropy numbers, leak status, pattern tags, crack-time estimate, and the suggestion/generator panels.

### `PasswordAnalyzer.html`
Just markup — the input box, gauges, panels, and the collapsible "how this works" explainer. Loads `style.css` and the 6 JS files above, in that dependency order (`data.js` first since everything else depends on it, `main.js` last since it wires everything together).

### `style.css`
All visual styling — the dark "terminal/console" look, using CSS variables for colors so the theme is easy to tweak from one place.

---

## ▶️ How to Run in VS Code

1. Download/clone the repo so `PasswordAnalyzer.html`, `style.css`, and the `js` folder (with all 6 files inside) are together in one folder
2. Open that folder in VS Code
3. Install the **Live Server** extension (by Ritwick Dey), if you don't have it
4. Right-click `PasswordAnalyzer.html` in the VS Code file explorer → **"Open with Live Server"**
5. It opens in your browser at `http://127.0.0.1:5500/PasswordAnalyzer.html` with live reload

No install steps beyond that — no `npm install`, no build, no dependencies. Plain HTML/CSS/JS.

You can also skip VS Code entirely and just double-click `PasswordAnalyzer.html` to open it directly in any browser — it works the same way, since everything runs client-side.

---

## 🌐 Live Version

No download needed — open it directly here:

**https://24r11a6278.github.io/Password-analyzer/PasswordAnalyzer.html**

---

## ⚠️ Scope & Disclaimer

This is a demonstration/learning tool, not a production security library — the leaked-password list is a small illustrative sample (not a full breach corpus), and pattern detection uses simple, explainable checks rather than a full library like `zxcvbn`. No passwords are stored, logged, or transmitted anywhere.

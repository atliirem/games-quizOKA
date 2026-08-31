# OKA Word Duel — Quiz Arena

A browser-based vocabulary and listening quiz game built for OKA (Online Kids Academy). The player races against an animated rival (Gigi, Mimi, or Bobo) through 10 timed questions, answering vocabulary and listening prompts to score points before the clock runs out.

## Features

- Head-to-head "duel" format against a randomly matched animal rival
- Timed rounds with a countdown arc and streak tracking
- Audio "listen" prompts alongside visual/text questions
- Animated race track showing live progress between player and rival
- Win/loss result screen with rematch and new-rival options

## Running locally

This is a static site with no build step. Open `index.html` directly in a browser, or serve the directory:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

- `index.html` — game markup and dialogs (matchmaking, results)
- `style.css` — visual styling
- `game.js` — game state, question bank, and duel logic
- `assets/` — logos, avatars, and rival character art

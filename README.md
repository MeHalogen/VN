# VN — Valentine Website

A tiny, lovable, single-page Valentine website (no framework) you can host anywhere.

## What’s included

- Simple flow: **Landing → Journey → The Question → Celebration**
- “No” button playfully dodges (but stays accessible)
- Easy personalization (names + 3 timeline moments) via **Customize** modal
- Shareable link via URL hash (no backend needed)

## Run locally

### Option A (recommended): Python

```zsh
cd /Users/mehalsrivastava/GitHub/VN
python3 -m http.server 5173
```

Then open http://localhost:5173

### Option B: Node (if you prefer)

```zsh
cd /Users/mehalsrivastava/GitHub/VN
npx serve .
```

## Personalize

Open the site and use:

- **Add your name** (landing screen)
- **Customize** (question screen)

Then click **Copy link** on the final screen to generate a shareable link that preserves your edits.

## Replace the background music (optional)

Put your own audio file at `assets/bgm.mp3` and it’ll play when you toggle Music.

If you don’t want music at all, you can delete the `<audio>` tag in `index.html`.

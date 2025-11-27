# Gun Skin Values — Static site

This lightweight static site shows a list of gun skins with their **worth**, **demand**, and **rarity**.

## How to use locally
1. Place these files in a folder (keep paths as-is).
2. Open `index.html` in your browser.  
   - If `skins.json` is next to `index.html` the site will load that data.
   - If `skins.json` is missing or blocked by CORS, sample data will be used.

## How to host on GitHub Pages
1. Create a GitHub repo and push these files to the `main` branch (root).
2. Enable GitHub Pages: Settings → Pages → Source: `main` branch `/ (root)`.
3. Wait a minute and visit `https://yourusername.github.io/repo-name`.

## Features
- Search, filter by demand, and sort.
- Lightweight client-side editor (edits data in your browser).
- JSON download/export.

## Want upgrades?
- Add thumbnail images: place them in `assets/` and fill the `image` field in `skins.json`.
- Add server persistence (I can show a simple Node/Express endpoint).
- Add authentication for editing (requires backend).

If you want, I can also:
- Provide a zipped folder ready to download,
- Add images for each skin,
- Add buy/sell price, price history chart, or rarity color map.

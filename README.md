# 2048 • Vite + React

An ultra-smooth, responsive, and themeable implementation of the classic **2048** puzzle game built with **React**, **TypeScript**, and **Vite**.

Designed with buttery 60+ FPS hardware-accelerated animations, fluid scaling across mobile and desktop, tactile swipe & keyboard controls, synthetic audio effects, and 7 customizable themes.

---

## ✨ Features

- **🚀 Ultra-Smooth Tiling & Merging Animations**
  - Continuous sliding transitions driven by GPU-accelerated CSS `transform: translate3d(...)`.
  - Tile IDs persist across movement, ensuring no teleporting or layout thrashing.
  - Independent pop-in and bounce physics for newly spawned and merged tiles (`scale` animations isolated on inner containers to prevent transform conflicts).
  - Subtle floating score indicators (`+4`, `+8`, `+16`...) that float up and fade on merges.

- **🎨 7 Handcrafted Color Themes**
  - **Classic Warm** – The iconic golden 2048 palette.
  - **Cyberpunk Neon** – High-contrast electric cyan, magenta, and yellow with dark neon backing.
  - **Nordic Frost** – Minimalist arctic blues and clean slate.
  - **Matcha Forest** – Calming botanical greens and bamboo accents.
  - **Sunset Pastel** – Gentle dusk shades of rose, twilight pink, and amber.
  - **Coffee & Mocha** – Deep espresso, warm roasted cocoa, and caramel crema.
  - **Synthwave 80s** – Retro arcade violet, laser magenta, and glowing turquoise.
  - Real-time swatch previews and persistent theme saving in `localStorage`.

- **🏆 2048 Milestone Greeting & Celebration**
  - When you hit the **2048** tile for the first time:
    - Celebratory confetti burst via `canvas-confetti`.
    - Triumphant audio fanfare.
    - An interactive modal congratulating you on reaching 2048.
    - Two clear options: **Keep Playing** (aim for 4096, 8192, and beyond) or **Start New Game**.

- **📱 Pixel-Perfect Mobile & Desktop Scaling**
  - Fully responsive fluid board sizing (`clamp()` & `calc()` math ensuring 100% fit on screens from 320px mobile to 4K desktop).
  - Native touch swipe gestures with `touch-action: none` to prevent accidental page scroll or pinch zoom.
  - Optional on-screen touch D-Pad toggle for comfortable one-handed mobile play.
  - Multi-input keyboard support:
    - **Arrow Keys**: `↑`, `↓`, `←`, `→`
    - **WASD Keys**: `W`, `A`, `S`, `D`
    - **Vim Keys**: `H`, `J`, `K`, `L`
    - **Undo**: `Z` or `Ctrl+Z`
    - **Restart**: `R`

- **🔊 Web Audio API Sound Effects**
  - Zero external MP3/WAV assets needed.
  - Dynamically synthesized sliding swoosh, pitch-scaled merge chimes (higher tiles produce higher harmonies), win fanfare, and game-over tones.
  - Mute / unmute toggle with memory.

- **💾 Game State Persistence & Undo**
  - Auto-saves the active board, score, and all-time best score to `localStorage`.
  - Re-opening or refreshing the browser never loses your progress.
  - One-step undo to reverse accidental moves.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🎮 How to Play

1. Slide tiles in any direction (**Up**, **Down**, **Left**, **Right**).
2. When two tiles with the same number collide, they **merge into one** with double the value!
3. After every move, a new tile (valued 2 or 4) appears on the board.
4. Reach the **2048** tile to achieve victory, then choose whether to keep playing for an all-time record score!

---

## 📁 Project Structure

```
├── public/
│   └── 2048-icon.svg             # Favicon
├── src/
│   ├── components/
│   │   ├── Board.tsx             # 4x4 background grid & tile layer
│   │   ├── GameOverModal.tsx     # Game Over dialog with stats
│   │   ├── Header.tsx            # Scores, badges, controls
│   │   ├── HowToPlayModal.tsx    # Guide & keyboard shortcut dialog
│   │   ├── MobileControls.tsx    # Optional touch D-pad
│   │   ├── ScoreBubble.tsx       # Floating +points popup
│   │   ├── ThemeSelector.tsx     # Color theme picker with swatches
│   │   ├── TileView.tsx          # Animated tile component
│   │   └── WinModal.tsx          # 2048 Milestone greeting modal
│   ├── game/
│   │   └── board.ts              # Core 2048 game logic & movement engine
│   ├── hooks/
│   │   ├── useGame.ts            # State machine (score, undo, storage)
│   │   ├── useKeyboard.ts        # Desktop keyboard listener
│   │   └── useTouchGesture.ts    # Mobile swipe gesture handler
│   ├── themes/
│   │   └── themes.ts             # 7 theme color definitions
│   ├── utils/
│   │   ├── confetti.ts           # Win confetti explosion
│   │   └── sound.ts              # Web Audio API sound generator
│   ├── App.tsx                   # Main layout & theme synchronization
│   ├── index.css                 # CSS variables, animations, responsive rules
│   ├── main.tsx                  # React DOM mount point
│   └── types.ts                  # TypeScript types & interfaces
├── .gitignore                    # Standard Git ignore rules
├── index.html                    # HTML template & viewport configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

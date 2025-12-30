# NEON PONG - Advanced Single Player Game

A visually stunning, feature-rich Pong game built with Next.js 15, TypeScript, and Canvas API. Play against a wall in this neon-themed arcade experience!

## Features

### Core Gameplay
- **Single Player Mode** - Challenge yourself against a wall
- **Progressive Difficulty** - Ball speeds up with each hit
- **Combo System** - Build streaks for bonus scoring
- **Three Difficulty Levels** - Easy, Medium, Hard
- **High Score Tracking** - Persistent localStorage saves

### Visual Effects
- **Neon Aesthetic** - Cyberpunk-inspired design with glowing elements
- **Rainbow Ball Trail** - Dynamic color-shifting trail effect
- **Particle Explosions** - Multi-colored particles on every collision
- **Animated Gradients** - Time-based color animations
- **Pulse Effects** - Reactive glow on paddle and wall hits
- **Floating Combo Text** - Visual feedback for milestone combos
- **Rounded Paddle** - Smooth, modern paddle design
- **Animated Grid Background** - Dynamic grid pattern with pulsing lines
- **Speed Meter** - Real-time ball speed visualization
- **FPS Counter** - Performance monitoring

### Advanced Features
- **Touch Controls** - Full mobile support with drag gestures
- **Responsive Design** - Adapts to any screen size
- **Smooth 60 FPS** - Optimized game loop
- **Canvas Optimization** - Hardware acceleration enabled
- **Multiple HUD Elements** - Score, combo, speed, and FPS displays
- **Game States** - Start screen, pause, game over with smooth transitions

### UI/UX Enhancements
- **Glassmorphism Cards** - Modern frosted glass effect on info panels
- **Gradient Borders** - Animated glowing borders
- **Hover Effects** - Interactive scaling and glow
- **Neon Typography** - Cyberpunk-style text with shadows
- **Emoji Icons** - Visual enhancement for sections
- **Animated Background Orbs** - Ambient lighting effects
- **Click-to-Start** - Canvas tap/click to begin

## Controls

### Keyboard
- **↑ / W** - Move paddle up
- **↓ / S** - Move paddle down
- **SPACE** - Start game / Pause / Resume
- **R** - Restart game

### Mobile
- **Touch & Drag** - Move paddle with touch gestures
- **Tap Canvas** - Start game

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Canvas API** - High-performance 2D graphics
- **Tailwind CSS** - Utility-first styling
- **LocalStorage API** - Persistent high score

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## Game Stats Tracked

- **Score** - Points earned from wall hits
- **High Score** - Best score ever achieved
- **Combo** - Current consecutive hits
- **Max Combo** - Highest combo in current session
- **Speed** - Real-time ball velocity
- **FPS** - Frame rate performance

## Difficulty Levels

- **Easy** - 70% base speed, perfect for beginners
- **Medium** - 100% base speed, balanced challenge
- **Hard** - 140% base speed, intense gameplay

## Performance

- Optimized Canvas rendering with `alpha: false`
- Efficient particle system with lifecycle management
- Smooth 60 FPS gameplay
- Minimal memory footprint
- Hardware-accelerated graphics

## Design Philosophy

Built with a focus on:
- **Visual Excellence** - Every element has glow, gradient, or animation
- **Responsive UX** - Works perfectly on mobile and desktop
- **Performance** - Never compromise on 60 FPS
- **Accessibility** - Clear visual feedback for all actions
- **Polish** - Attention to every detail

## Future Enhancements

Potential additions:
- Sound effects and music
- Power-ups and obstacles
- Multiplayer mode
- Leaderboards
- Customizable themes
- Additional game modes

## Credits

Built with Next.js & TypeScript
Designed with modern web technologies

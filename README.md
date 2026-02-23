<div align="center">

<!-- <img src="assets/images/icon.png" alt="App Icon" width="120" height="120" /> -->

# 🧠 Blync

<!-- ### *Train smarter. Score higher. Get placed.* -->

A high-performance **iOS & Android** app for practicing cognitive ability tests used in placement assessments at top-tier tech companies — built with React Native & Expo.

<br/>

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![NativeWind](https://img.shields.io/badge/NativeWind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://nativewind.dev/)
[![Reanimated](https://img.shields.io/badge/Reanimated_3-6366f1?style=for-the-badge&logo=react&logoColor=white)](https://docs.swmansion.com/react-native-reanimated/)

<br/>

[📱 Download](#-quick-start) · [🐛 Report a Bug](https://github.com/NishulDhakar/BlyncWeb/issues) · [✨ Request a Feature](https://github.com/NishulDhakar/BlyncWeb/issues)

</div>

---

## 📸 Preview

![preview](assets/images/preview.png)

---

## 🎯 Why Cognitive Games?

Most candidates walk into cognitive placement tests cold. **Cognitive Games** changes that — offering a dedicated mobile platform to practice the exact assessment formats used by top tech companies, so you're confident on test day.

- ✅ Authentic test formats — not generic brain teasers
- ✅ Mobile-first — practice anywhere, anytime
- ✅ Performance tracking — see your growth over time
- ✅ Beautiful UX — actually enjoyable to use

---

## ✨ Features

### 🎮 Game Modes
Practice six distinct cognitive assessment types found in real placement exams:

| Game | What It Tests |
|------|---------------|
| 🧩 **Memory Challenge** | Short-term recall and visual memory |
| 🔲 **Grid Challenge** | Spatial awareness and pattern recognition |
| 🔢 **Digit Challenge** | Number processing and working memory |
| 🏃 **Motion Challenge** | Reaction time and dynamic tracking |
| 💡 **Deductive Reasoning** | Logical inference and rule application |
| ➕ More coming soon... | — |

### 📊 Progress & Leaderboards
- Global leaderboard rankings to benchmark against others
- Detailed per-game performance analytics
- Session history to track improvement over time

### 🎨 Cozy Minimalist Design
A warm, soft neo-brutalist UI — thick borders, flat style, and playful interactions that make practice feel less like studying and more like gaming.

### ⚡ Silky Smooth Performance
Built on **React Native Reanimated 3** and **Gesture Handler** to deliver 60fps animations across all game types, including sliding puzzles and motion-based challenges.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Expo + Expo Router | File-based routing & cross-platform build tooling |
| **Language** | TypeScript 5 | Fully typed codebase |
| **Styling** | NativeWind v4 | Tailwind utility classes compiled to native styles |
| **Animations** | Reanimated 3 + Gesture Handler | 60fps physics-based animations & touch gestures |
| **State** | Zustand | Lightweight global state (Auth, Theme, Game logic) |
| **UI Extras** | Expo Blur & Linear Gradient | Native overlays and backgrounds |

---

## 🚀 Quick Start

Get the app running locally in under 2 minutes.

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Mac only) or Android Emulator, **or** the [Expo Go](https://expo.dev/go) app on your phone

### 1. Clone the repo

```bash
git clone https://github.com/NishulDhakar/BlyncWeb.git
cd CognitiveGamesApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

> The `-c` flag clears the bundler cache — required the first time to ensure NativeWind v4 processes correctly.

```bash
npx expo start -c
```

### 4. Open the app

| Platform | How |
|----------|-----|
| 📱 **Real Device** | Scan the QR code in the terminal with the [Expo Go](https://expo.dev/go) app |
| 🍎 **iOS Simulator** | Press `i` in the terminal |
| 🤖 **Android Emulator** | Press `a` in the terminal |

---

## 🏗 Project Structure

The project uses a **feature-based architecture** combined with Expo Router conventions:

```
src/
├── app/                   # Expo Router screens & layouts (file-based routing)
│   ├── (tabs)/            # Tab navigator screens
│   └── game/[id].tsx      # Dynamic game screen
│
├── components/            # Shared, reusable UI components
│
├── features/              # Domain-specific logic
│   ├── auth/              # Authentication flows
│   ├── games/             # Game engine & renderers
│   │   └── motion/        # Motion Challenge specific logic
│   └── leaderboard/       # Rankings & stats
│
├── store/                 # Zustand global state slices
│   ├── auth.store.ts
│   ├── theme.store.ts
│   └── game.store.ts
│
└── utils/                 # Helper functions & formatters
```

---

## 🤝 Contributing

Contributions are what make open source great. Whether you're fixing a bug, suggesting a game mode, or improving the UI — we'd love your help!

**Steps to contribute:**

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Please read the [Contributing Guidelines](CONTRIBUTING.md) before submitting.

---

## 🐛 Known Issues / Roadmap

- [ ] Offline mode support
- [ ] Dark / Light theme toggle
- [ ] More game types (Verbal Reasoning, Abstract Patterns)
- [ ] Push notifications for daily challenges
- [ ] Profile page with achievement badges

---

## 📄 License

Licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. Free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ by [Nishul Dhakar](https://www.nishul.dev)

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/nishuldhakar)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Nishuldhakar)

_If you found this helpful, consider giving it a ⭐ on GitHub!_

</div>
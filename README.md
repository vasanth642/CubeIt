<div align="center">
  <h1>CuboSapiens (CubeIt / Vantage)</h1>
  <p><strong>The Next-Generation, 3D Interactive Speedcubing Suite</strong></p>
  <p>A premium, blazing-fast Rubik's Cube timer with a built-in 3D visualizer, advanced statistics, and seamless offline capabilities.</p>
</div>

<p align="center"><img width="399" height="398" alt="Screenshot 2026-04-14 161242" src="https://github.com/user-attachments/assets/a5c22da1-53bf-4387-9ca7-5acb88cdfd0d" /></p>
<img width="1918" height="942" alt="Screenshot 2026-04-16 192953" src="https://github.com/user-attachments/assets/134b6d24-b1f8-4895-bb0b-10e12a5ce847" />
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/abc4310f-bc32-4a37-a0e3-c5c494d726d4" />


## Why This Timer?

Traditional cube timers are just static numbers on a screen. **CuboSapiens** reimagines the speedcubing experience with a highly polished, Apple-inspired "Amethyst & Slate" dark mode UI, powered by modern 3D graphics. 

Watch a 3D Rubik's Cube perfectly mirror your randomly generated scrambles in real-time. Whether you are practicing your CFOP algorithms or striving for a new Personal Best, CuboSapiens provides a completely distraction-free, professional environment.

##  Key Features

- **Real-Time 3D Visualizer:** Powered by React Three Fiber and Three.js, it translates WCA notation scrambles into smooth, animated 3D cube rotations.
- **WCA-Compliant Timing:** Features a standard 15-second inspection phase, keyboard spacebar controls, and mobile tap-to-start precision.
- **Advanced Analytics:** Automatically tracks and calculates your PB, Session Average, Ao5 (Average of 5), and Ao12 (Average of 12).
- **Persistent Sessions:** All solves and statistics are securely saved in your browser's Local Storage. No database required.
- **Responsive Design:** A beautifully unified interface that scales perfectly from 4K desktop monitors down to mobile screens with touch-optimized controls.
- **Focus Mode:** UI elements gracefully fade away when the timer starts, allowing absolute concentration on the solve.

## Progressive Web App (PWA) - Install It Locally!

CuboSapiens is built as a highly optimized **Progressive Web App (PWA)**. This means you do not have to keep it as an open browser tab—you can install it directly onto your device!

**Features of the PWA:**
- **100% Offline Capable:** Once loaded, you never need an internet connection to use the timer or view your history.
- **Native App Feel:** Launches from your desktop or phone home screen without any browser address bars or tabs.
- **Lightning Fast:** Assets are aggressively cached by a service worker for instant loading times.

**How to Install:**
1. Open the deployed application link in an up-to-date browser (Chrome, Edge, or Safari).
2. Look for the **"Install App"** icon in the right side of the URL address bar, or select "Add to Home Screen" from your mobile browser's menu.
3. Launch it directly from your device!

## Getting Started (Development)

Want to run CuboSapiens on your local machine or contribute? It's easy!

### Prerequisites
- Node.js (v16.x or newer)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/CuboSapiens.git
   cd CuboSapiens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The application will start, usually accessible at `http://localhost:3000`.

4. **Build for Production:**
   ```bash
   npm run build
   ```
   This compiles the highly optimized static files into the `build/` directory, ready to be deployed to Vercel, Netlify, or GitHub Pages.

## Technology Stack

- **Core**: React 18
- **3D Graphics**: Three.js, React Three Fiber (@react-three/fiber), React Three Drei (@react-three/drei)
- **Animations**: Tween.js
- **Styling**: Vanilla CSS with modern Glassmorphism and dynamic gradients.
- **Tooling**: Webpack (via custom r3f-pack)

## 🤝 Contributing
Contributions are always welcome! Whether it is adding new themes, creating different puzzle types (2x2, Pyraminx), or optimizing the 3D performance. If you have a feature idea, feel free to open an Issue or submit a Pull Request.

---
<div align="center">
  <i>Built for speedcubers, by a speedcuber. Happy solving! 🏁</i>
</div>

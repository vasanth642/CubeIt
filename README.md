<div align="center">

  <img width="100%" alt="CubeIt Banner" src="https://raw.githubusercontent.com/shresthgoel77-png/CubeIt/shresthgoel77-png-patch-1/public/CubeIt%20banner.png" />
</div>
<h1 align="center" id="Cubeit">CubeIt</h1>
<div align="center">
  <strong>The Next-Generation, 3D Interactive Speedcubing Suite</strong>
</div>

<div align="center">
  A premium, blazing-fast Rubik's Cube timer with a built-in 3D visualizer,
  advanced statistics, and seamless offline capabilities.
</div>


<p align="center">
  <a href="https://cube-it-app.netlify.app/">Live Link</a>
</p>

##  Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Visual Showcase](#visual-showcase)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Contact](#contacts)

---
##  About the Project <a name="about-the-project"></a>

Traditional cube timers are just static numbers on a screen. **CubeIt** reimagines the speedcubing experience with a highly polished, "Amethyst & Slate" dark mode UI, powered by modern 3D graphics. 

Watch a 3D Rubik's Cube perfectly mirror your randomly generated scrambles in real-time. Whether you are practicing your CFOP algorithms or striving for a new Personal Best, CubeIt provides a completely distraction-free, professional environment.

**Core Highlights:**
* **Interactive 3D Elements:** Built-in 3D visualizer using Three.js.
* **Performance Tracking:** Advanced analytics including Ao5, Ao12, and PB tracking.
* **Installable:** Fully functional offline via Progressive Web App (PWA) architecture.

---

##  Key Features <a name="key-features"></a>

-  **Real-Time 3D Visualizer:** Powered by React Three Fiber and Three.js, it translates WCA notation scrambles into smooth, animated 3D cube rotations.
-  **WCA-Compliant Timing:** Features a standard 15-second inspection phase, keyboard spacebar controls, and mobile tap-to-start precision.
-  **Advanced Analytics:** Automatically tracks and calculates your PB, Session Average, Ao5 (Average of 5), and Ao12 (Average of 12).
-  **Persistent Sessions:** All solves and statistics are securely saved in your browser's Local Storage. No database required.
-  **Responsive Design:** A beautifully unified interface that scales perfectly from 4K desktop monitors down to mobile screens with touch-optimized controls.
-  **Focus Mode:** UI elements gracefully fade away when the timer starts, allowing absolute concentration on the solve.

---

##  Tech Stack <a name="tech-stack"></a>

Built with modern web and 3D technologies:
* <img src="https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 18" />
* <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white" alt="Three.js" />
* <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
* <img src="https://img.shields.io/badge/Webpack-8DD6F9?style=flat-square&logo=webpack&logoColor=black" alt="Webpack" />
* <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />

---

## Visual Showcase <a name="visual-showcase"></a>

### Desktop Experience
<div align="center">
  <table style="border-collapse: collapse; width: 100%;">
    <tr>
      <th style="text-align: center;">Desktop Timer</th>
      <th style="text-align: center;">Desktop Analytics</th>
    </tr>
    <tr>
      <td align="center" width="50%">
        <img width="100%" alt="Desktop Timer" src="https://github.com/user-attachments/assets/134b6d24-b1f8-4895-bb0b-10e12a5ce847" />
      </td>
      <td align="center" width="50%">
        <img width="100%" alt="Desktop Analytics" src="https://github.com/user-attachments/assets/abc4310f-bc32-4a37-a0e3-c5c494d726d4" />
      </td>
    </tr>
  </table>
</div>

### Mobile Experience
<div align="center">
  <table style="border-collapse: collapse; width: 100%;">
    <tr>
      <td width="50%" align="center" valign="top">
        <img width="70%" alt="Mobile Timer Interface" src="https://github.com/user-attachments/assets/09f40083-fe03-4fa8-9dfb-ca5b66db9434" />
      </td>
      <td width="50%" align="center" valign="top">
        <img width="70%" alt="Mobile Analytics Interface" src="https://github.com/user-attachments/assets/226d666c-1014-4ff4-811b-6ed5185e307c" />
      </td>
    </tr>
  </table>
</div>

---

## Getting Started <a name="getting-started"></a>

### 1. Progressive Web App (PWA) - Install It Locally!
CubeIt is built as a highly optimized **Progressive Web App (PWA)**. This means you do not have to keep it as an open browser tab—you can install it directly onto your device!

**Features of the PWA:**
- **100% Offline Capable:** Once loaded, you never need an internet connection to use the timer or view your history.
- **Native App Feel:** Launches from your desktop or phone home screen without any browser address bars or tabs.
- **Lightning Fast:** Assets are aggressively cached by a service worker for instant loading times.

**How to Install:**
1. Open the deployed application link in an up-to-date browser (Chrome, Edge, or Safari).
2. Look for the **"Install App"** icon in the right side of the URL address bar, or select "Add to Home Screen" from your mobile browser's menu.
3. Launch it directly from your device!

### 2. Local Development
Want to run CubeIt on your local machine to tinker with the code? It's easy!

**Prerequisites**
- Node.js (v16.x or newer)
- npm or yarn

**Installation Steps**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/CubeIt.git
   cd CubeIt
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

---

## Documentation <a name="documentation"></a>

### Contributing
Contributions are always welcome! Whether it is adding new themes, creating different puzzle types (2x2, Pyraminx), or optimizing the 3D performance. If you have a feature idea, feel free to open an Issue or submit a Pull Request.

<a name="contacts"></a>
## Contacts

| Source | Link |
| :--- | :--- |
| **GitHub Profile** | [vasanth642](https://github.com/vasanth642) |
| **Project Repository** | [CubeIt](https://github.com/vasanth642/CubeIt) |

### Credits
The 3D Rubik’s Cube model used in this project is a modified version of the original work by **Sean Bradley**.

---
<p align="center">
  <b>Built for speedcubers, by a speedcuber. Happy solving! 🏁</b>
  <br>
  Don't forget to ⭐ star the repo if you like this project!
</p>

## Troubleshooting

### Installation fails
- Ensure you are using the supported Node.js version.
- Run `npm install` or `npm ci`.
- Delete `node_modules` and reinstall dependencies if necessary.

### Environment variables not loading
- Verify that a `.env` file exists.
- Ensure all required variables are defined.
- Restart the development server after making changes.

## FAQ

### How do I start the project?
Run:

```bash
npm install
npm run dev
```

### How do I report a bug?
Please open a GitHub issue with reproduction steps and relevant logs.


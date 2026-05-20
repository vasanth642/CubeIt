# Contributing to CubeIt 🧊⏱️

First off, thank you for considering a contribution to **CubeIt** — the 3D interactive speedcubing timer that turns scrambles into real‑time animated cube rotations. Whether you’re fixing a tiny CSS glitch, adding a new puzzle type, or improving the PWA experience, your time and effort make this project better for cubers everywhere.

This guide is your one‑stop handbook. It’ll walk you through everything you need to start contributing smoothly — especially if you’re new to open source or joining from programs like GSSoC or Hacktoberfest.

---

## 🎉 Welcome & Code of Conduct

We’re excited to have you here! CubeIt is a welcoming community for everyone, regardless of experience level. To keep this space safe and respectful, we expect all contributors to be **kind, constructive, and inclusive**. Harassment, trolling, or any form of disrespect won’t be tolerated. Basically, just be a good human!

If you ever feel uncomfortable or notice something off, please reach out to the project maintainers — we’re here to help.

> **First‑time contributor?** Don’t be nervous. Every expert was once a beginner. Feel free to ask questions in an issue or discussion before opening a PR. We’re here to help you learn.

---

## 🏠 Local Setup Guide

To get CubeIt running on your machine, follow these steps. You’ll need [Node.js](https://nodejs.org/) (v16 or newer) and [npm](https://www.npmjs.com/) (or yarn).

### Fork the Repository: 

Click the "Fork" button at the top right corner of the repository to create your own copy.

### Clone Your Fork: 

Clone your forked repository to your local machine using the following command:

git clone https://github.com/<your-username>/CubeIt.git
cd CubeIt 

### Create a Branch: 

Create a new branch for your changes:

git checkout -b my-feature

### Make Changes: 

Make your desired changes to the codebase.

### Commit Changes: 

Commit your changes with a descriptive commit message:

git commit -m "Add new feature"

### Push Changes: 

Push your changes to your forked repository:

git push origin my-feature

### Submit a Pull Request: 

Go to your forked repository on GitHub and submit a pull request. Be sure to provide a detailed description of your changes and why they are necessary.

## 🌿 Branching & Commit Conventions

Keeping a clean history makes collaboration painless. Please stick to these simple rules.

### Branch naming

Create a new branch from main with a descriptive name:

#### Feature / enhancement → feature/<short-description>
e.g., feature/2x2-puzzle-support, feature/scramble-export

#### Bug fix → fix/<short-description>
e.g., fix/mobile-tap-timing, fix/average-ao5-calculation

#### Documentation → docs/<short-description>
e.g., docs/add-pwa-install-instructions

#### Refactoring / chores → chore/<short-description>
e.g., chore/update-dependencies

If your work addresses an open issue, you can add the issue number:
fix/issue-42-inspection-timer-audio

# CubeIt Contributor Guidelines

## 📋 Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) style. It's short, searchable and tells exactly what you did.

**Format:** `type(optional scope): concise message`

### Common Types

| Type     | Description                              |
| -------- | ---------------------------------------- |
| `feat`   | a new feature                            |
| `fix`    | a bug fix                                |
| `docs`   | documentation only                       |
| `style`  | code formatting, no logic change         |
| `chore`  | build process or tooling updates         |
| `refactor` | code restructuring without feature change |

### Examples
feat: add pyraminx scramble generator |
fix: correct inspection countdown on mobile |
docs: clarify local storage usage in README |
style: clean up timer container padding |


If your commit closes an issue, add a footer:

feat: implement session export as JSON
Closes #23


> **Small, focused commits** are always preferred over a massive single commit. They make reviews faster and reverting easier.

---

## 📬 Pull Request (PR) Checklist

Ready to submit your work? Awesome! Before you hit that green button, please go through this checklist. It ensures your PR gets merged quickly and with minimal back‑and‑forth.

- [ ] **I have tested my changes locally**  
  `npm start` runs without errors, and I’ve manually verified the feature/fix works as expected.  
  For UI changes, I checked on both desktop (responsive widths) and mobile viewports.

- [ ] **My code follows the existing style**  
  CubeIt uses plain CSS (glassmorphism, dynamic gradients) and React hooks. I’ve kept the same patterns, naming conventions, and folder structure.

- [ ] **No console warnings or errors**  
  The browser dev‑tools console is clean. No leftover `console.log` statements.

- [ ] **I’ve linked the relevant issue**  
  The PR description contains a reference like `Closes #12` or `Fixes #12` so the issue is automatically closed when the PR merges.

- [ ] **The PR description is clear**  
  I’ve explained what I did, why I did it, and how to test it. For UI changes, I’ve attached before/after screenshots or a short screen recording.

- [ ] **I’m ready for feedback**  
  I understand that maintainers might request changes, and I’ll address them constructively.

### Opening the PR

Push your branch to your fork and open a pull request against the `main` branch of the original CubeIt repository. A template will pre‑fill; just fill in the blanks.

Once submitted, the maintainers will review it as soon as possible. If everything looks good, your contribution will be merged and you’ll officially be a CubeIt contributor! 🎉

---

![alt text](<public/Screenshot 2026-05-18 193128.png>)


Stick to the existing folder patterns when adding files. If you’re unsure where something belongs, just ask in your issue or PR.

---

## 💡 Where to Start?

- Browse open issues with the **“good first issue”** or **“help wanted”** labels.
- Comment on the issue you’d like to take, and a maintainer will assign it to you.
- After assignment, follow the setup & branching guide and start coding.

No issue matches your idea? Feel free to open a new one describing the enhancement or bug before coding, so we can discuss it together.

---

Thank you for helping make **CubeIt** the best speedcubing timer on the web. Whether you’re a speedcuber yourself or just love clean UI and 3D graphics — we’re excited to see what you build.

Happy solving! 🏁

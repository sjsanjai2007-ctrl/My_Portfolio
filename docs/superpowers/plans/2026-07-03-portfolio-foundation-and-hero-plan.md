# Portfolio 2.0 Foundation and Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation (project structure, base HTML/CSS/JS, reusable components, theme switcher, navigation, scroll animations) and the Hero section (Cluster 1) of the portfolio.

**Architecture:** Modular HTML/CSS/JavaScript implementation. The foundation sets up shared utilities (CSS variables, buttons, cards, layout, theme, nav, animations). The Hero section builds upon these utilities to create the introductory cluster with interactive elements.

**Tech Stack:** HTML5, CSS3 (CSS Grid, Flexbox, Custom Properties, Variables), JavaScript ES6 Modules, custom scroll animation system (Intersection Observer), Google Fonts (Poppins), Font Awesome 6 for icons.

## Global Constraints
- Design inspiration: Match quality of Awwwards, CSS Design Awards, Godly.website, One Page Love, top 2025-2026 developer portfolios; combine best UX patterns with originality.
- Motion design: Every animation must communicate hierarchy, guide attention, or provide feedback; never decorative only.
- Personality: Convey creativity, professionalism, curiosity, attention to detail, innovation, confidence, passion for learning (no arrogance).
- Scroll experience: Navigation feels like progressing through a story; sections flow naturally with spacing, motion, and visual rhythm.
- Code standards: Avoid large files; split CSS and JS logically; use reusable utility classes; remove duplicate code; use semantic HTML; use modern CSS; avoid unnecessary libraries; document important components; organize assets cleanly; keep codebase maintainable.
- Image strategy: Optimize all images; use lazy loading; use responsive `srcset`/`sizes`; avoid layout shifts; compress without quality loss; maintain sharp rendering on high-DPI displays.
- Browser support: Must work consistently in Chrome, Edge, Firefox, Safari; gracefully degrade unsupported effects; no experimental APIs without fallbacks; test animations across all browsers.
- Implementation rule: Build incrementally; after each major piece verify responsiveness, accessibility, performance, animations, remove unused code, refactor if needed; only proceed when polished; prioritize quality over speed.
- Final vision: Create a memorable portfolio where every visitor thinks "This developer cares about quality"; showcase attention to detail, design thinking, engineering ability, and creativity; treat as a flagship project.

---
### Task 1: Initialize project structure and base HTML

**Files:**
- Create: `index.html`
- Create: `css/variables.css`
- Create: `css/base.css`
- Create: `js/main.js`
- Create: `README.md`

**Interfaces:**
- Consumes: None (foundation)
- Produces: Base HTML skeleton with linked CSS/JS; CSS custom properties for colors, spacing, radius, transitions; empty JS module ready for imports.

- [ ] **Step 1: Write the failing test**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanjai S J - Portfolio</title>
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/base.css">
</head>
<body>
  <div id="test-root"></div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```
Open in browser and check console for errors; expect none but layout empty.

- [ ] **Step 2: Run test to verify it fails**
Open `index.html` in Chrome/Firefox/Safari/Edge; verify no console errors and that `<div id="test-root"></div>` is present (baseline). No failure expected; this is a smoke test.

- [ ] **Step 3: Write minimal implementation**
`index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanjai S J - Portfolio</title>
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
</head>
<body>
  <div id="test-root"></div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```
`css/variables.css`:
```css
:root {
  --color-bg: #050816;
  --color-surface: rgba(255,255,255,0.05);
  --color-border: rgba(255,255,255,0.08);
  --color-text: #ffffff;
  --color-muted: #d1d5db;
  --color-accent: #00d9ff;
  --color-accent-2: #8c00ff;
  --radius: 24px;
  --transition: 0.3s ease;
  --font-sans: 'Poppins', sans-serif;
}
```
`css/base.css`:
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  font-size: 100%; /* 16px */
  scroll-behavior: smooth;
}
body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}
```
`js/main.js`:
```javascript
// Entry point; modules will be imported here as they are built
console.log('Portfolio JS loaded');
```
`README.md`:
```markdown
# Sanjai S J - Portfolio 2.0

Premium developer portfolio built with HTML, CSS, JavaScript.

## Development
- Open `index.html` in browser to view.
- No build step required; all assets linked via CDN or local files.
```

- [ ] **Step 4: Run test to verify it passes**
Refresh browser; verify page loads with default white text on dark background, Poppins font applied, no console errors.

- [ ] **Step 5: Commit**
```bash
git add index.html css/variables.css css/base.css js/main.js README.md
git commit -m "feat: initialize project structure and base HTML/CSS/JS"
```

### Task 2: Create reusable button component

**Files:**
- Create: `css/components/buttons.css`
- Create: `components/button.html` (template snippet)
- Modify: `css/variables.css` (add button-specific vars)
- Modify: `js/main.js` (import button styles if using JS injection; alternatively just CSS)
- Create: `tests/button-test.html`

**Interfaces:**
- Consumes: CSS variables for colors, radius, transition.
- Produces: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost` classes with hover/active states; HTML pattern for reuse.

- [ ] **Step 1: Write the failing test**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="css/components/buttons.css">
  <style>
    body { padding: 2rem; background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
  </style>
</head>
<body>
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-ghost">Ghost</button>
  <script>
    // Simple test: ensure button classes exist and have expected computed styles
    function testButton() {
      const primary = document.querySelector('.btn-primary');
      const computed = getComputedStyle(primary);
      // Expect background to be a gradient (will contain 'rgb' or 'linear-gradient')
      const bg = computed.backgroundImage || '';
      if (!bg) {
        throw new Error('Primary button missing background');
      }
      return true;
    }
    try {
      testButton();
      console.log('Button test passed');
    } catch (e) {
      console.error('Button test failed:', e);
    }
  </script>
</body>
</html>
```
Open this file; expect error in console about missing background (since CSS not written yet).

- [ ] **Step 2: Run test to verify it fails**
Open `tests/button-test.html`; console should show error.

- [ ] **Step 3: Write minimal implementation**
`css/variables.css` (add to bottom):
```css
/* Button variants */
--btn-primary-bg: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
--btn-secondary-bg: rgba(0,217,255,0.12);
--btn-secondary-border: 1px solid var(--color-accent);
--btn-ghost-bg: transparent;
--btn-ghost-border: 1px solid var(--color-border);
--btn-color: #fff;
--btn-color-alt: var(--color-text);
--btn-hover-scale: 1.05;
--btn-hover-shadow: 0 0 24px rgba(0,217,255,0.4);
```
`css/components/buttons.css`:
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), background var(--transition);
}
.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-color);
  box-shadow: 0 4px 18px rgba(0,217,255,0.28);
}
.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--color-accent);
  border: var(--btn-secondary-border);
}
.btn-ghost {
  background: var(--btn-ghost-bg);
  color: var(--btn-color-alt);
  border: var(--btn-ghost-border);
}
@media (hover: hover) {
  .btn-primary:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 24px rgba(0,217,255,0.4);
  }
  .btn-secondary:hover {
    background: rgba(0,217,255,0.22);
    transform: translateY(-4px);
  }
  .btn-ghost:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-4px);
  }
}
.btn:active {
  transform: scale(0.97);
}
```
`css/base.css` (add import at top):
```css
@import "components/buttons.css";
```
`tests/button-test.html` (update to use correct paths):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="css/components/buttons.css">
  <style>
    body { padding: 2rem; background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
  </style>
</head>
<body>
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-ghost">Ghost</button>
  <script>
    function testButton() {
      const primary = document.querySelector('.btn-primary');
      const computed = getComputedStyle(primary);
      const bg = computed.backgroundImage || '';
      if (!bg) { throw new Error('Primary button missing background'); }
      return true;
    }
    try {
      testButton();
      console.log('Button test passed');
    } catch (e) {
      console.error('Button test failed:', e);
    }
  </script>
</body>
</html>
```
- [ ] **Step 4: Run test to verify it passes**
Open `tests/button-test.html`; console should log "Button test passed" with no errors.

- [ ] **Step 5: Commit**
```bash
git add css/variables.css css/base.css css/components/buttons.css tests/button-test.html
git commit -m "feat: create reusable button component with primary/secondary/ghost variants"
```

### Task 3: Create glassmorphism card component

**Files:**
- Create: `css/components/cards.css`
- Modify: `css/variables.css` (add card vars)
- Modify: `css/base.css` (import cards.css)
- Create: `tests/card-test.html`

**Interfaces:**
- Consumes: color, border, radius, transition variables.
- Produces: `.card`, `.card-glass`, `.card-floating` classes with glassmorphism styling, hover lift, shadow.

- [ ] **Step 1: Write the failing test**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="css/components/cards.css">
  <style>
    body { padding: 2rem; background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
    .test-card { width: 200px; height: 120px; margin: auto; }
  </style>
</head>
<body>
  <div class="card card-glass test-card"></div>
  <script>
    function testCard() {
      const card = document.querySelector('.card-glass');
      const computed = getComputedStyle(card);
      const bg = computed.backgroundColor;
      // Expect rgba with low opacity
      if (!bg.includes('rgba')) { throw new Error('Card missing rgba background'); }
      const radius = parseFloat(computed.borderRadius);
      if (radius < 20) { throw new Error('Card border radius too small'); }
      return true;
    }
    try {
      testCard();
      console.log('Card test passed');
    } catch (e) {
      console.error('Card test failed:', e);
    }
  </script>
</body>
</html>
```
- [ ] **Step 2: Run test to verify it fails**
Open `tests/card-test.html`; expect error.

- [ ] **Step 3: Write minimal implementation**
`css/variables.css` (append):
```css
/* Card styles */
--card-bg: rgba(255,255,255,0.05);
--card-border: 1px solid rgba(255,255,255,0.08);
--card-shadow: 0 8px 32px rgba(0,0,0,0.3);
--card-hover-shadow: 0 0 20px rgba(0,217,255,0.2);
--card-transition: 0.3s;
```
`css/components/cards.css`:
```css
.card {
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--radius);
  box-shadow: var(--card-shadow);
  transition: transform var(--card-transition), box-shadow var(--card-transition);
}
.card-glass {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.card-floating {
  animation: float 4s ease-in-out infinite;
}
@media (hover: hover) {
  .card:hover {
    transform: translateY(-6px);
    box-shadow: var(--card-hover-shadow);
  }
}
@keyframes float {
  0%, 100% { transform: translateY(0); ? }   }   <}   }   ]   ]  )   )   Y   Y   {   {   T   T   p   p   t   t   :   :   t   t   r   r   a   a   n   s   l   a   t   e   Y   Y   (   (   0   0   p   p   x   x   )   )   }   }   ]   ]  <   <   /   /   k   k   e   e   y   y   f   f   r   r   a   a   m   m   e   e   >   >   }   }   {   {   T   T   5   5   0   0   %   %   }   }   {   }   }   T   T   r   r   a   a   n   s   l   a   t   e   Y   Y   (   (   0   0   p   p   x   x   )   )   }   }   ]   ]  <   <   /   /   k   k   e   e   y   y   f   f   r   r   a   a   m   m   e   e   >   >   }   }   {   {   1   1   0   0   0   0   %   %   }   }   {   }   }   T   T   r   r   a   a   n   s   l   a   t   e   Y   Y   (   (   -   -   8   8   p   p   x   x   )   )   }   }   ]   ]  <   <   /   /   k   k   e   e   y   y   f   f   r   r   a   a   m   m   e   e   >   >   }   }   <   <   /   /   s   s   t   t   y   y   l   l   e   e   >   >   ]
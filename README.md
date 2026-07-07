# Isaac Zachariah — Portfolio

A handcrafted, professional frontend developer portfolio (dark theme).

Tech: HTML5 · CSS3 · JavaScript · Bootstrap (utilities) · Mobile-first · Vercel-ready

Project structure

portfolio/
│── index.html
│── contact.html
│── README.md
│── assets/
│   ├── images/
│   ├── icons/
│   └── cv/
│── css/
│   ├── style.css
│   └── responsive.css
│── js/
│   └── script.js

Getting started

- Open `index.html` in a browser for a quick preview.
- The contact form is on `contact.html`.
- Add or replace images in `assets/images/` (profile.svg, project-placeholder.svg).
- Styles live in `css/style.css` (dark, tokenized) and `css/responsive.css` (breakpoints).
- Interactive behavior goes in `js/script.js`.

Deploying to Vercel

1. Create a Git repository and push this project.
2. Log in to Vercel and import the repository (or run `vercel` from the project root).
3. Vercel will detect a static site and deploy automatically.

Notes

- Mobile-first CSS and progressive enhancement are used: the site works without JavaScript.
- Keep images optimized (WebP preferred) and provide `srcset` where applicable.
- Ensure the PDF resume is placed at `assets/cv/Isaac_Zachariah_CV.pdf` for the download button.
- To enable contact form persistence, configure Firebase and uncomment SDKs in `index.html`.

# Huzaifa Usman — Portfolio

A static, dependency-free portfolio (HTML5 + CSS3 + vanilla JavaScript). No build step, no
frameworks. Open `index.html` in a browser or host the folder anywhere.

## Folder structure

```
portfolio/
├── index.html          # Home: hero, intro, core skills, featured projects, services, tech, CTA
├── about.html          # About, journey, skill categories, cybersecurity learning, experience
├── projects.html       # Filterable projects + cybersecurity learning labs
├── contact.html        # Contact details, social links, validated contact form
├── css/
│   └── style.css       # All styling + design tokens
├── js/
│   └── script.js       # Navbar, particles, reveals, counters, filtering, form validation
├── assets/
│   ├── images/         # Project previews + og-cover.jpg
│   └── icons/          # favicon.svg
└── README.md
```

## Setup

1. Download / clone the `portfolio` folder.
2. Double-click `index.html` — that's it. (Optional local server: `python3 -m http.server`.)

## Replacing images

Project previews live in `assets/images/`. Keep the same filenames to swap an image with zero
code changes, or update the `src` in the relevant `<article class="card project">` block and edit
the `alt` text. Recommended size: **1200 × 750** (16:10), JPG, under ~250 KB.
`assets/images/og-cover.jpg` is the social-share preview (1200 × 630 also works).

## Changing colors

Everything is driven by CSS variables at the top of `css/style.css`:

```css
:root {
  --bg: #05060a;        /* page background */
  --accent: #2ee6a8;    /* primary accent (buttons, glows, highlights) */
  --accent-2: #4d8bff;  /* secondary accent for gradients */
  --text: #eaf0ff;
  --muted: #99a5c3;
}
```

Change `--accent` and the whole site follows. Also update `<meta name="theme-color">` in each page
if you change `--bg`.

## Adding a project

Copy one `<article class="card project" data-category="...">` block in `projects.html` and edit:

- `data-category` — any of `web`, `frontend`, `fullstack`, `design`, `security` (space-separated for multiple)
- the `<img>` `src` + `alt`
- the `<span class="cat">` label, `<h3>` title, description, `.tag` items
- the **View Project** link, and a **GitHub** link only if a real repo exists

Filtering picks new cards up automatically — no JS edits needed.

## Connecting the contact form

Currently there is no backend; validation runs client-side and submitting opens a pre-filled
email draft. Pick one option:

**Formspree (easiest)**
1. Create a form at formspree.io and copy your endpoint.
2. In `contact.html`, change:
   `<form id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST" novalidate>`

**EmailJS**
1. Add the EmailJS CDN script before `js/script.js`.
2. Keep `action="#"` and call `emailjs.sendForm(...)` inside the submit handler in `js/script.js`
   (marked with the "No endpoint configured yet" comment).

**Netlify Forms** — host on Netlify and add `netlify` plus `data-netlify="true"` to the `<form>` tag.

Also update the fallback address in `js/script.js` if your email changes.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then: **Repo → Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
Your site goes live at `https://<you>.github.io/<repo>/`.
All internal links are relative (`./about.html`), so it works in a subfolder without changes.
For a custom domain, add a `CNAME` file containing your domain and point DNS at GitHub Pages.

## Content notes

- Skills, services, stats (4+ years, 50+ projects) and project links come from the previous portfolio.
- Cybersecurity is presented as an active **learning track** (labs in VMs / authorised environments) — no certifications or professional pentest claims.
- Placeholders to fill in yourself: the second/third **experience & education** entries in `about.html`,
  a **LinkedIn** link in `contact.html` (commented out), and write-up links for the security labs.

## Accessibility & performance

Semantic landmarks, skip link, visible focus rings, `alt` text everywhere, `aria-current` on the
active nav item, lazy-loaded images, and full `prefers-reduced-motion` support.
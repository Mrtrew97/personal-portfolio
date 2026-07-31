# Bruno Pinto — Software Developer Portfolio

A modern multilingual portfolio built with HTML, CSS, JavaScript, Bootstrap, and JSON.

### Live Demo

[https://mrtrew97.github.io/personal-portfolio/](https://mrtrew97.github.io/personal-portfolio/)

## Screenshots

![Portfolio Preview](assets/images/readme/preview.webp)

## Overview

A modern, responsive, and multilingual portfolio website built to showcase my projects, technical skills, professional experience, education, and certifications. The application follows a modular architecture and consumes external JSON data to keep content separated from presentation.

## Core Features

- ✓ English (default) and Portuguese language support
- ✓ Dark & Light theme switching with `localStorage` persistence
- ✓ Dynamic content loaded from external JSON files (projects, skills, experience, education, certificates)
- ✓ Modular JavaScript architecture with separated concerns (`i18n.js`, `data.js`, `router.js`, `ui.js`, `main.js`)
- ✓ Client-side routing using view partials (`pages/`)
- ✓ Asynchronous contact form powered by Formspree
- ✓ Fully responsive layout built with Bootstrap 5.3
- ✓ Ready for deployment with GitHub Pages

## Technologies

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup and view partials |
| CSS3 | Styling, CSS variables, and modular layers |
| JavaScript (ES6+) | Application logic and client-side routing |
| Bootstrap 5.3 | UI components and grid system |
| Bootstrap Icons | Professional icon set |
| JSON | External data sources and i18n dictionaries |
| Fetch API | Asynchronous data loading |
| Formspree | Contact form handling |
| GitHub Pages | Static hosting |

## Architecture

The application separates presentation, data, and business logic into independent modules, making the codebase easier to maintain and extend:

- **HTML5** → Semantic shell (`index.html`) and view partials (`pages/`)
- **CSS** → Separated styling layers adhering to the `.bp-` prefix convention
- **JSON** → External data sources (`i18n/` and `data/`)
- **JavaScript Modules** → Client-side routing, state management, and dynamic rendering

## Project Structure

```text
personal-portfolio/
│
├── index.html
├── .gitignore
├── README.md
└── LICENSE
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── components.css
│   │   └── pages.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── i18n.js
│   │   ├── data.js
│   │   ├── router.js
│   │   └── ui.js
│   │
│   ├── images/
│   ├── icons/
│   └── documents/
│       └── Bruno_Pinto_CV.pdf
│
├── data/
│   ├── i18n/
│   │   ├── pt.json
│   │   └── en.json
│   │
│   ├── projects.json
│   ├── skills.json
│   ├── experience.json
│   ├── education.json
│   └── certificates.json
│
└── pages/
    ├── home.html
    ├── about.html
    ├── projects.html
    ├── skills.html
    ├── experience.html
    ├── education.html
    ├── certifications.html
    └── contact.html
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Mrtrew97/personal-portfolio.git
```

Open `index.html` in your browser or serve the project using your preferred local web server (e.g., Live Server in VS Code).

## Configuration

Replace `YOUR_ENDPOINT` with your own Formspree endpoint inside `pages/contact.html`:

```html
<form id="bp-contact-form" action="https://formspree.io/f/YOUR_ENDPOINT" method="POST">
```

## Author

**Bruno Pinto**

- GitHub: [https://github.com/Mrtrew97](https://github.com/Mrtrew97)
- LinkedIn: [https://www.linkedin.com/in/bruno-pinto-2418043a3/](https://www.linkedin.com/in/bruno-pinto-2418043a3/)

## License

This repository is intended for portfolio and educational purposes.
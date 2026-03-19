Personal Academic Homepage. Customized based on [AcaNova-X](https://github.com/yihangtao/AcaNova-X).

## Quick Start

### Run Locally

```bash
git clone https://github.com/yuxuan-bot/yuxuan-bot.github.io.git
cd yuxuan-bot.github.io

# Python 3
python -m http.server 8080

# Or Node.js
npx http-server . -p 8080
```

Open `http://localhost:8080` in your browser.

#### Edit Content

Modify the JSON files in the `data/` folder:

| File                | Description                         |
| ------------------- | ----------------------------------- |
| `profile-info.json` | Personal info (email, social links) |
| `publications.json` | List of publications                |
| `news.json`         | News & updates                      |
| `honors.json`       | Awards & honors                     |

Edit `index.html` to customize:

* Personal introduction
* Education and internship experience
* Academic service
* Profile photo and Favicon
* **Life Skills & Fun Learning cards**
* **Visitor map configuration**

### Deploy to GitHub Pages

```bash
git add .
git commit -m "Update homepage"
git push origin main
```

Then go to **Settings → Pages** in your repository:

* Source: `main` branch
* Wait 1-3 minutes and visit `https://<username>.github.io`


## File Structure

```
├── index.html              # Homepage (fixed sidebar layout, Life Skills & Visitor)
├── styles.css              # Styles (grid layout, sticky positioning, card design)
├── script.js               # Main logic (navigation, scroll, link handling)
├── view-all.js             # Expand/collapse functionality (smooth animation)
├── pages/                  # Full pages
│   ├── all-news.html
│   ├── all-honors.html
│   └── all-publications.html
├── data/                   # Data (JSON)
│   ├── profile-info.json
│   ├── publications.json
│   ├── news.json
│   └── honors.json
└── assets/                 # Images and resources
```


## Key Features

* **Data-Driven**: All content is independent of HTML; updating JSON files updates the website.
* **Professional Layout**: Crimson Text + Inter fonts, Gold accent, glass-style navbar.

  * Desktop: Fixed sidebar layout with sticky personal info card.
  * Mobile: Responsive single-column layout with stacked content.
* **CCF Tagging**: Publications automatically detect CCF grade (A/B/C).
* **Optimized Expand/Collapse**: Smooth “View All” animation with icon transitions.
* **Visitor Statistics**:

  * Sidebar minimal counter: total visits + today’s visits (icons).
  * Visitor page: global visitor map visualization.
* **Customizable Sections**: Life Skills & Fun Learning card grid to showcase hobbies (food, sports, etc.).
* **Smooth Interactions**: Active navigation highlight, smooth scrolling, card hover animations, mobile menu toggle.
* **SEO-Friendly**: Includes sitemap.xml and complete meta tags.



## License

Based on [AcaNova-X](https://github.com/yihangtao/AcaNova-X). See [LICENSE](LICENSE) for details.

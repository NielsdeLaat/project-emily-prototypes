# Interactive 3D Globe Web App

## Project Summary: `globe/` Directory

### Purpose
- An interactive, minimalistic 3D globe web app using Globe.gl and Three.js
- Features country highlighting on hover/click and country info display
- Designed for extensibility (pins, chatbots, filters, etc. can be added later)

### Key Files
- `index.html`  
  - Main HTML entry point
  - Loads `main.js` as a module and includes the required containers for the globe, loading indicator, and country info

- `main.js`  
  - Main JavaScript logic
  - Uses Globe.gl to render the globe and handle country highlighting and info
  - Fetches country polygons from a public GeoJSON source
  - Handles window resizing and UI updates

- `styles.css`  
  - Minimal, modern styling for the globe, loading indicator, and info popup

### How It Works
- On page load, the globe is initialized with a light grey land color and a creme background
- Country polygons are fetched from a public GeoJSON file
- Hovering over a country highlights it in blue and shows its name at the bottom
- Clicking a country keeps it highlighted and shows its name
- The app is designed to be extended with pins, popups, chatbots, or other features

### How to Run
1. Open a terminal in the `globe/` directory
2. If using Vite or another dev server, run it from the project root and open `globe/index.html`
3. If using a static server, serve the `globe/` directory and open `index.html` in your browser

### Notes for Future Development
- Only edit files in the `globe/` directory to avoid conflicts with other projects
- To add features (pins, chatbots, filters, etc.), extend `main.js` using Globe.gl's API
- If you need to update country data, change the GeoJSON fetch URL in `main.js`
- For more advanced features, refer to the [Globe.gl documentation](https://github.com/vasturiano/globe.gl)

### Essential Files
The following files are essential for the project:
- `index.html`
- `main.js`
- `styles.css`

---

**Important Note:** Work only in the `globe/` directory. All project logic and assets are self-contained here. 
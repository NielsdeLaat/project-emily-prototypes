# 🌍 Emily Interactive Globe – React + Mapbox Prototype

Dit project is een interactieve wereldbol-ervaring waarmee gebruikers op een visuele manier in contact kunnen komen met verhalen van onderdrukte mensen wereldwijd. De globe is gebouwd in React en gebruikt Mapbox GL JS en een TopoJSON-laag om landen als interactieve gebieden weer te geven.

---

## 🔍 Over het project

Deze globe is onderdeel van **Project Emily** (zie Virtual-Human), een AI-gedreven storytellingconcept dat voortkomt uit een VPRO-hackathon. Gebruikers kunnen een locatie aanklikken op de wereldkaart om een beknopte samenvatting van een verhaal te lezen, waarna ze in gesprek kunnen gaan met een AI-chatbot gebaseerd op een verteller uit dat gebied. Dit prototype is bedoeld om geëxperimenteer met narratieve interfaces en empathische datarepresentatie te faciliteren.

---

## ✨ Functionaliteiten

- Wereldbol met interactieve landen via `countries-110m.json` (TopoJSON)
- Hover- en klikinteracties (selectie en animatie)
- Structuur klaar voor uitbreiding met AI-chat per land
- Geoptimaliseerd met Vite voor snelle ontwikkeling

---

## ⚙️ Installatie

1. Zorg dat je Node.js geïnstalleerd hebt (aanbevolen versie: 18+)
2. Clone deze repository of kopieer de bestanden naar je lokale omgeving
3. Installeer dependencies:


npm install

4. Start de development server:

npm run dev
De globe is nu beschikbaar op http://localhost:5173

## 🧠 Technieken & Tools
- React: voor componentgebaseerde opbouw van de interface
- Vite: voor snelle bundling en HMR tijdens development
- Mapbox GL JS: voor weergave van de 3D-globe
- TopoJSON (countries-110m.json): voor nauwkeurige rendering van landen als polygons
- Modulaire CSS: styling via App.css en index.css
## 📁 Bestandsstructuur

📦 project-root
 ┣ 📂public/           → bevat de `countries-110m.json` en eventuele assets
 ┣ 📂src/
 ┃ ┣ 📄App.jsx         → hoofdcomponent
 ┃ ┣ 📄GlobeView.jsx   → Mapbox-globe component met TopoJSON parsing
 ┃ ┣ 📄main.jsx        → entrypoint van de app
 ┃ ┣ 📄App.css         → component styling
 ┃ ┗ 📄index.css       → globale styling
 ┣ 📄index.html        → HTML template
 ┣ 📄vite.config.js    → Vite configuratie
 ┣ 📄package.json      → projectmetadata en scripts

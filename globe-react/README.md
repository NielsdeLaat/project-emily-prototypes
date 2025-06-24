# 🌍 Interactive Globe - Human Rights Stories

I have created an immersive web application that tells the stories of people around the world who have faced human rights challenges. Users can explore an interactive 3D globe, discover personal narratives, and track their progress through different categories of human rights issues and regions.

For this project I worked with cursor AI and GPT to create this prototype that you can visit on
https://hover-cards-emily.vercel.app 
![overview](readimages/1.png)


## Features

- **Interactive 3D Globe**: Navigate a beautiful 3D globe powered by Mapbox GL
- **Personal Stories**: Explore detailed narratives from 7 individuals across different countries
- **Progress Tracking**: Monitor your exploration progress with a comprehensive tracking system
![progress](readimages/2.png)
- **Category Filtering**: Filter stories by human rights categories (Religious Persecution, LGBTQ+ Rights, Racism, etc.)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dutch Localization**: Fully localized interface in Dutch
- **Visual Feedback**: Hover cards, visited state indicators, and smooth animations

## Story Categories

- **Religieuze Vervolging** (Religious Persecution) ⛪
- **LHBTI+ Rechten** (LGBTQ+ Rights) 🏳️‍🌈
- **Racisme** (Racism) ✊
- **Politieke Onderdrukking** (Political Oppression) 🗳️
- **Genderrechten** (Gender Rights) ♀️
- **Vluchteling** (Refugee Status) 🏃

## Quick Start

### Prerequisites

- Node.js (version 14 or higher) [![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
- npm or yarn package manager 	[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#) 	[![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=fff)](#)
- Modern web browser with WebGL support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NielsdeLaat/project-emily-prototypes/tree/development-lin/globe-react 
   cd globe-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🎮 How to Use

### Exploring the Globe
- **Navigate**: Click and drag to rotate the globe
- **Zoom**: Use scroll wheel or pinch gestures to zoom in/out
- **Countries**: Click on any country to see stories from that location
- **Markers**: Click on story markers to view detailed narratives

### Reading Stories
- **Hover Cards**: Hover over markers to see story previews
- **Full Stories**: Click "Lees verder" to read complete narratives
- **Chat Function**: Access chat functionality after reading stories
- **Progress Tracking**: View your exploration progress in the top-left corner

### Filtering Content
- **Category Filters**: Use the filter panel to focus on specific human rights issues
- **Country View**: Click countries to see all stories from that location
- **Search Results**: View filtered results with clear feedback

## Technologies Used

- **React 18**: Modern React with hooks and functional components [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
- **Mapbox GL JS**: Interactive 3D globe and mapping 
- **Tailwind CSS**: Utility-first CSS framework for styling [![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
- **Vite**: Fast build tool and development server 	[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
- **Local Storage**: Progress tracking and user state persistence

## Project Structure

```
globe-react/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   └── ProgressOverview.jsx
│   ├── utils/             # Utility functions
│   │   └── progressUtils.js
│   ├── img/               # Story character images
│   ├── App.jsx            # Main application component
│   ├── GlobeView.jsx      # Core globe functionality
│   └── main.jsx           # Application entry point
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Customization

### Adding New Stories
1. Add character images to `src/img/`
2. Update the `sidebarItems` array in `GlobeView.jsx`
3. Add expanded story content to the `expandedStories` object
4. Update progress tracking utilities if needed

### Styling
- Modify Tailwind classes in components
- Update CSS variables in `src/index.css`
- Customize color scheme in `tailwind.config.cjs`

### Localization
- Update text content in `GlobeView.jsx`
- Modify category labels and descriptions
- Update tooltips and UI text

## Configuration

### Mapbox Token
Replace the Mapbox access token in `GlobeView.jsx`:
```javascript
mapboxgl.accessToken = 'your-mapbox-token-here';
```

### Story Data
Update story locations, categories, and content in the `sidebarItems` and `expandedStories` objects.

## Troubleshooting

### Common Issues

**Globe not loading**
- Check your Mapbox access token
- Ensure you have an active internet connection
- Verify WebGL support in your browser

**Stories not appearing**
- Check the browser console for JavaScript errors
- Verify that all image files are present in `src/img/`
- Ensure story data is properly formatted

**Progress not saving**
- Check if localStorage is enabled in your browser
- Clear browser cache and try again
- Verify the progress utility functions

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow React best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## License

This project is open source and licensed under the MIT License

## Acknowledgments

- **Mapbox** for providing the 3D globe technology
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **All contributors** who help improve this project


**Made with ❤️ for human rights education and awareness** 

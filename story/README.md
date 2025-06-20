# Story – Social Media Story Prototype

An immersive web application that tells the stories of people around the world who have faced human rights challenges, in the form of a social media story. For the prototype, users can select from a set of video subjects. Then they can watch the narratives unfold with subtitles, and click between sections at their desire.

## Features

- **Multiple Stories**: A set of three fully developed stories to watch
- **Segmented Video Playback**: Stories are divided into thematic video segments with progress tracking, like on socials
- **Subtitle Support**: All videos feature Dutch subtitles for accessibility
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Visual Feedback**: Smooth transitions, progress bars, and modern UI elements

## Stories

Stories cover a range of human rights topics, including:

- **Hong Kong Demonstrations**
- **LGBTQ Rights in Uganda**
- **Refugees from North-Korea**

## Quick Start

### Prerequisites

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#) [![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=fff)](#)

- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NielsdeLaat/project-emily-prototypes.git
   cd project-emily-prototypes/story
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
   Navigate to `http://localhost:8080` to view the application

## 🎮 How to Use

### Selecting and Watching Stories

- **Choose a Story**: On the home screen, select a story to begin
- **Segmented Playback**: Watch the story unfold in video segments, each with Dutch subtitles
- **Progress Bar**: Track your progress through the story segments at the top of the screen
- **Subtitles**: Read along with the on-screen Dutch subtitles for each segment
- **Skip/Advance**: Click the video to advance to the next segment, or skip the story with the button

### Chat Integration

- **Chat Access**: After completing a story, the chat interface will open in a new window for further discussion or exploration

## Technologies Used

[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development for robust code
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server

## Project Structure

```
story/
├── public/
│   ├── favicon.ico
│   ├── images/           # UI images
│   ├── robots.txt
│   └── videos/           # Story video segments
├── src/
│   ├── components/       # React components (StoryViewer, ProgressBar, etc.)
│   ├── data/             # Story data (stories.ts)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components (Index, NotFound)
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Customization

### Adding New Stories

1. Add new video files to `public/videos/`
2. Update the `stories` array in `src/data/stories.ts` with new story metadata, segments, and subtitles
3. (Optional) Add or update images in `public/images/` for UI enhancements

### Styling

- Modify Tailwind classes in components for custom styles
- Update CSS variables in `src/index.css`
- Customize color scheme in `tailwind.config.ts`

### Localization

- Update text content in components and data files for further localization
- Modify category labels and descriptions in `src/data/stories.ts` or UI components

## Troubleshooting

### Common Issues

**Videos not playing**

- Ensure all video files are present in `public/videos/`
- Check the browser console for errors
- Verify supported video formats (MP4 recommended)

**Stories not appearing**

- Check that the `stories` array in `src/data/stories.ts` is correctly formatted
- Ensure all referenced video files exist

**Chat not opening**

- Make sure pop-ups are allowed in your browser
- Check the chat interface URL in the code (should open a new window after story completion)

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow React and TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## License

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

This project is open source and licensed under the MIT License

## Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **All contributors** who help improve this project

**Made with ❤️ for human rights education and awareness**

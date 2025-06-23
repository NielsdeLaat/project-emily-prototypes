# Chat Interface – MTalking with AI Prototype

A modern web application that lets users chat and call with virtual personas who have lived through human rights challenges. The interface is inspired by popular messaging apps, making it accessible and familiar. Users can select a persona, send messages, receive AI-powered responses, and simulate calls—all in a safe, privacy-conscious environment.

![Chat UI](readme-images/chat.png)

[Link naar het online prototype](https://project-emily-chat-interface.vercel.app/)

## Features

- **Chat with Personas**: Send and receive messages with a range of unique personas, each with their own story and background
- **Multiple Personas**: Choose from several personas, each with a unique avatar and introduction
- **Modern, Familiar UI**: Inspired by WhatsApp and other popular messaging apps
- **Safe API Integration**: ChatGPT integration is handled securely, with API keys stored safely and never exposed to users
- **Example Questions**: AI generated questions to help keep the conversation going

## Personas

- **Emily** – Refugee from Hong Kong
- **Jason** – Journalist and activist from Hong Kong
- **Kadir** – Uyghur survivor from Xinjiang
- **Sae-Byeok** – Refugee from North Korea
- **Mugisha** – LGBTQ+ activist from Uganda
- **Tyrone** – LGBTQ+ refugee from Uganda
- **Frabrice** – Transgender refugee from Burundi

Each persona has a unique story and responds authentically within their lived experience.

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
   cd project-emily-prototypes/chat-interface
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

## 🗨️ How to Use

- **Choose a Persona**: On the main menu, select a persona to start chatting
- **Send Messages**: Type and send messages; the persona will reply in real time
- **Switch Personas**: Return to the main menu to chat with a different persona
- **Choose an Example Question**: Click on the lightbulb next to the send button and recieve some tips

## Technologies Used

[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development for robust code
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **OpenAI API**: Secure integration for AI-powered chat responses

## Project Structure

```
chat-interface/
├── public/
│   ├── avatars/           # Persona avatar images
│   ├── favicon.ico
│   ├── images/            # UI images
│   └── ...
├── src/
│   ├── components/        # React components (ChatInterface, CallInterface, PersonaMenu, etc.)
│   ├── config/            # Persona and app configuration
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── services/          # API and chat services
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Customization

### Adding or Editing Personas

- Update `src/config/personas.ts` to add or modify persona details, avatars, and prompts
- Add new avatar images to `public/avatars/`

### Styling

- Modify Tailwind classes in components for custom styles
- Update CSS variables in `src/index.css`
- Customize color scheme in `tailwind.config.ts`

### Localization

- Update text content in components and config files for further localization

## Troubleshooting

**Chat not working?**

- Ensure your OpenAI API key is set in a local `.env` file (not committed to version control)
- Check the browser console for errors
- Make sure the API key is valid and has sufficient quota

**Avatars or images not loading?**

- Check that all image files are present in `public/avatars/` and `public/images/`

**Call function not working?**

- The call feature is visual only (no audio); ensure your browser supports modern CSS and JavaScript

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

## Process

This prototype evolved from a hackathon concept, where the need for a less direct, more accessible way to interact with AI personas was identified. The interface was inspired by messaging apps like WhatsApp, and developed further to include multiple personas, avatars, and secure ChatGPT integration. The API key is stored securely in a local `.env` file and never exposed to users.

## License

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

This project is open source and licensed under the MIT License

## Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **OpenAI** for the chat API
- **All contributors** who help improve this project

**Made with ❤️ for human rights education and awareness**

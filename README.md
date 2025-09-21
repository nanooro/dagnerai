# Oshi no Ko AI Chat Application

An interactive AI chat application featuring characters from the anime/manga series "Oshi no Ko". Users can chat with AI versions of their favorite characters using Google Gemini AI.

## Features

- **Character-based AI Chat**: Chat with Ai Hoshino, Aqua Hoshino, Ruby Hoshino, Kana Arima, Akane Kurokawa, and Mem-cho
- **Draggable Chat Interface**: Modern UI with draggable input modal
- **Character Knowledge Base**: Each character has detailed personality, relationships, and backstory
- **Real-time Responses**: Powered by Google Gemini AI for authentic character responses

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Gemini API

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a `.env.local` file in the project root
3. Add your API key:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting with your favorite Oshi no Ko characters!

## Available Characters

- **Ai Hoshino**: Energetic idol and mother figure
- **Aqua Hoshino**: Intelligent and analytical actor
- **Ruby Hoshino**: Passionate idol with big dreams
- **Kana Arima**: Professional actress and idol
- **Akane Kurokawa**: Strategic and perceptive actress
- **Mem-cho**: Energetic social media personality

## Usage

1. Navigate to `/chat?character=CharacterName` (e.g., `/chat?character=Ai%20Hoshino`)
2. Start chatting with the AI character
3. The character will respond based on their personality and knowledge from the series

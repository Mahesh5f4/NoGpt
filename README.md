<div align="center">
<h1>NoGPT</h1>
<p>An AI-powered web application that helps you learn to say "No" respectfully and confidently.</p>
</div>

## Overview

NoGPT is a React application designed to help users protect their boundaries. Describe a situation where you need to say no (e.g., your boss asking you to work overtime), and NoGPT will provide a realistic conversation script to handle the situation professionally.

## Features

- **AI-Powered Scripts:** Leverages Google's Gemini API to generate context-aware, respectful responses.
- **Customizable Tones:** Choose the right tone for the situation, from professional to casual.
- **Multilingual Support:** Generate responses in multiple languages to suit your needs.
- **Modern UI:** A clean, responsive interface built with React, Tailwind CSS, and Lucide Icons.

## Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mahesh5f4/NoGpt.git
   cd NoGpt
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env.local` (or `.env`).
   - Add your Gemini API Key:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Building for Production

To create a production build and run it:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## Technologies Used

- React 19
- Vite
- Express (Backend API)
- Google Gen AI SDK
- Tailwind CSS 4
- TypeScript

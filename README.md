# Smart To-Do

A dependency-aware task management application with automatic state propagation and cascading updates.

## Overview

Smart To-Do is an intelligent task management system that automatically handles task dependencies and state management. When tasks have dependencies, the system automatically blocks or unblocks them based on the completion status of their prerequisites. It also features cascading updates - when a completed task is changed to an incomplete state, all dependent tasks are automatically reset to maintain data integrity.

## Features

- **Dependency-Aware Task Management**: Tasks can have dependencies on other tasks
- **Automatic State Management**: Tasks are automatically blocked when dependencies are incomplete
- **Cascading Updates**: When a task changes from "done" to any other state, dependent tasks are reset to "todo"
- **Real-time UI Updates**: Instant feedback with toast notifications and visual indicators
- **Smart State Transitions**: Only actionable tasks can be modified by users
- **Modern UI**: Clean, responsive design with purple-themed styling

## Technology Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.15 with custom design system
- **State Management**: TanStack Query (React Query) 5.90.5
- **HTTP Client**: Axios 1.12.2
- **Backend**: JSON Server 1.0.0-beta.3 (for development)
- **UI Components**: Radix UI with Lucide React icons
- **Node.js**: Version 24

## Task States

- **Todo**: Ready to be worked on
- **In Progress**: Currently being worked on
- **Done**: Completed
- **Blocked**: Cannot be worked on due to incomplete dependencies

## Getting Started

### Prerequisites

- Node.js v24 or higher
- npm (comes with Node.js)

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the JSON Server (Backend)**
   ```bash
   npx json-server db.json5 --port 3000
   ```
   This will start the mock API server on `http://localhost:3000`

3. **Start the Development Server (Frontend)**
   ```bash
   npm run dev
   ```
   This will start the Vite development server, typically on `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   └── TaskCard.tsx    # Main task component
├── pages/              # Page components
│   └── Tasks.tsx       # Main tasks page
├── hooks/              # Custom React hooks
├── api/                # API client and utilities
├── types.d.ts          # TypeScript type definitions
└── index.css           # Global styles and CSS variables
```

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task completely
- `PATCH /tasks/:id` - Partially update a task
- `DELETE /tasks/:id` - Delete a task

## Development Notes

- The application uses a custom color system with CSS variables
- Task dependencies are managed automatically by the frontend
- State changes trigger cascading updates to maintain consistency
- The UI provides visual feedback for blocked tasks and dependency relationships

# Task Management App - Frontend

A modern, responsive React + TypeScript frontend for the Task Management application with ShadCN UI components and Tailwind CSS.

## 🚀 Features

- **Authentication**: Login and registration with JWT
- **Task Management**: Create, read, update, and delete tasks
- **Dialogs**: ShadCN UI–based confirmation dialogs for deleting tasks and logging out
- **Filtering**: Filter tasks by status, priority, and search
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Zustand for efficient state handling
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: ShadCN UI components with beautiful design

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8000`

## 🛠️ Installation

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 🏃‍♂️ Running the Application

**Development mode:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Build for production:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # UI components (Button, Input, etc.)
│   │   ├── TaskDialog.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskCardSkeleton.tsx
│   │   ├── ConfirmLogoutDialog.tsx
│   │   └── DeleteTaskDialog.tsx
│   ├── pages/          # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── DashboardPage.tsx
│   ├── stores/         # Zustand stores
│   │   ├── authStore.ts
│   │   └── taskStore.ts
│   ├── services/       # API services
│   │   └── api.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── lib/            # Utilities
│   │   └── utils.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Key Technologies

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **ShadCN UI**
- **Zustand**
- **React Router**
- **Axios**
- **Lucide React**

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## 🔑 Features Overview

### Authentication

- Login and register with JWT
- Token-based authentication
- Auto logout on token expiry

### Task Management

- Create, edit, and delete tasks
- Confirmation dialogs for delete and logout
- Filter by status, priority, and search
- View task statistics

### UI/UX Features

- Modern design using ShadCN UI
- Task cards with skeleton loading
- Smooth animations and transitions
- Responsive grid layout

## 🧪 Testing the Application

1. **Start the backend:**

```bash
uvicorn app.main:app --reload
```

2. **Start the frontend:**

```bash
npm run dev
```

3. **Open:** `http://localhost:5173`

## 🔐 Security Features

- JWT stored in localStorage
- Protected routes with auth check
- CORS configured on backend

## 📝 Environment Variables

| Variable            | Description          | Default                        |
| ------------------- | -------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

## 🚀 Production Deployment

1. **Build the app:**

```bash
npm run build
```

2. **Deploy `dist` folder** to Vercel, Netlify, or any static host.

3. **Set environment variable:**

```
VITE_API_BASE_URL=https://your-production-api.com/api/v1
```

## 📞 Support

For any issues, contact: hr@horizonlabs.ai

## 📄 License

This project is created for technical assessment purposes.

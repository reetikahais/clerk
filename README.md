# React + Tailwind CSS Sample Project

A modern, production-ready starter project combining React and Tailwind CSS for building a comprehensive property management dashboard.

## 🎯 Features

- **React 18** - Latest version with hooks and concurrent rendering
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Lightning-fast build tool and dev server
- **Responsive Design** - Mobile-first approach with responsive components
- **Sample Components** - Pre-built examples for your project:
  - 📊 Dashboard with statistics and property listings
  - 🏠 Floor Plan visualization
  - 🔄 360° Property Viewer with rotation controls
  - 📱 Mobile Photo Capture interface

## 📁 Project Structure

```
react-tailwind-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx        # Main dashboard view
│   │   ├── FloorPlan.jsx        # Floor plan visualization
│   │   ├── Viewer360.jsx        # 360° viewer
│   │   └── MobileCapture.jsx    # Mobile capture interface
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind imports
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
└── postcss.config.js             # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎨 Tailwind CSS Usage

The project uses Tailwind's utility classes throughout. Examples:

```jsx
// Text styling
<h1 className="text-2xl font-bold text-gray-900">Heading</h1>

// Spacing
<div className="px-6 py-4 space-y-4">

// Colors
<button className="bg-blue-500 text-white hover:bg-blue-600">

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

## 📚 Key Components

### Dashboard
- Statistics cards with real-time data
- Property listing table
- Status badges with color coding

### Floor Plan
- SVG-based room visualization
- Interactive layout with measurements
- Furniture representation

### 360° Viewer
- Rotation controls (left/right)
- Real-time angle display
- Property details display

### Mobile Capture
- Camera interface simulator
- Photo capture history
- Progress tracking
- Status indicators

## 🛠️ Customization

### Change Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      secondary: '#YOUR_COLOR',
    },
  },
}
```

### Add New Components
1. Create a new `.jsx` file in `src/components/`
2. Use Tailwind classes for styling
3. Import and use in `App.jsx`

### Remove Components
To remove a feature, delete the component file and remove its navigation button from `App.jsx`.

## 📦 Dependencies

- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - DOM rendering
- **tailwindcss** (^3.3.0) - CSS framework
- **vite** (^4.3.0) - Build tool
- **postcss** & **autoprefixer** - CSS processing

## 🌟 Tips

- Use Tailwind's `@apply` directive in `index.css` to create custom component classes
- Leverage responsive modifiers: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Use Tailwind's color palette for consistency
- Check [tailwindcss.com](https://tailwindcss.com/docs) for the full utility reference

## 📝 License

MIT - Feel free to use this project however you like

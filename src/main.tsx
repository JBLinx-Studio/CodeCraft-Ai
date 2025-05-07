
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './App.css';

/**
 * Main entry point of the application
 * Renders the App component to the DOM
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
root.render(<App />);

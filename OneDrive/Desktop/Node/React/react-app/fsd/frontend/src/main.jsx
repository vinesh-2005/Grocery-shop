import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root');
console.log('[DEBUG] Root element:', root);
console.log('[DEBUG] React mounting...');

try {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('[DEBUG] React mounted successfully');
} catch(e) {
  console.error('[DEBUG] React mount error:', e);
  root.innerHTML = `<div style="padding:40px;color:red;font-family:sans-serif;"><h2>Mount Error</h2><pre>${e.toString()}\n\n${e.stack}</pre></div>`;
}

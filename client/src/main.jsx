import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeContextProvider } from './context/ThemeContext.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import AuthProvider from './context/AuthContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </StrictMode>,
);

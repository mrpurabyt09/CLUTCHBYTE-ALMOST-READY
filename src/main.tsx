import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ModelProvider } from './context/ModelContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ModelProvider>
        <App />
      </ModelProvider>
    </AuthProvider>
  </StrictMode>,
);

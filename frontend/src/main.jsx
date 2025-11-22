import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { UserNicknameProvider } from './UserNickname'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserNicknameProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserNicknameProvider>
  </StrictMode>
);

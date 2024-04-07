import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ContextsContainer from './context/ContextsContainer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContextsContainer>
      <App />
    </ContextsContainer>
  </React.StrictMode>,
);

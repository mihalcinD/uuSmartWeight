import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ProvidersContainer from './context/ProvidersContainer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProvidersContainer>
      <App />
    </ProvidersContainer>
  </React.StrictMode>,
);

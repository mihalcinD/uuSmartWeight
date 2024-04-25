import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import { routesConfig } from './routes/config.ts';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {Object.values(routesConfig).map((config, index) => (
            <Route key={index} path={config.path} element={<config.component />} />
          ))}
          <Route path={'*'} element={<Navigate to={'/'} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Dashboard from './routes/Dashboard.tsx';
import Devices from './routes/Devices.tsx';
import Statistics from './routes/Statistics.tsx';
import SetDetail from './routes/SetDetail.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={'/'} element={<Dashboard />} />
          <Route path={'/statistics'} element={<Statistics />} />
          <Route path={'/set/:id'} element={<SetDetail />} />
          <Route path={'/devices'} element={<Devices />} />
          <Route path={'*'} element={<Navigate to={'/'} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import Dashboard from './Dashboard.tsx';
import { JSX } from 'react';
import Statistics from './Statistics.tsx';
import SetDetail from './SetDetail.tsx';
import Devices from './Devices.tsx';

export const routesConfig: Record<
  string,
  { label: string; path: string; search?: Record<string, string>; component: () => JSX.Element; showInMenu?: boolean }
> = {
  DASHBOARD: {
    label: 'Home',
    path: '/',
    component: Dashboard,
    showInMenu: true,
  },
  STATISTICS: {
    label: 'Statistics',
    path: '/statistics',
    component: Statistics,
    search: { date: new Date().toISOString().slice(0, 10) },
    showInMenu: true,
  },
  SET_DETAIL: {
    label: 'Set Detail',
    path: '/set/:id',
    component: SetDetail,
  },
  DEVICES: {
    label: 'Devices',
    path: '/devices',
    component: Devices,
  },
};

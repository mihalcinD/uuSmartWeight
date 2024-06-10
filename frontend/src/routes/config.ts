import Dashboard from './Dashboard.tsx';
import { JSX } from 'react';
import Statistics from './Statistics.tsx';
import SetDetail from './SetDetail.tsx';
import Devices from './Devices.tsx';
import dayjs from 'dayjs';

export type PageConfig = {
  label: string;
  path: string;
  search?: Record<string, string>;
  component: () => JSX.Element;
  showInMenu?: boolean;
};

export const routesConfig: Record<string, PageConfig> = {
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
    search: { date: dayjs().format('YYYY-MM-DD') },
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

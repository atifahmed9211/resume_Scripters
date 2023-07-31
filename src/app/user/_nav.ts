import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/user/dashboard',
    icon: 'icon-speedometer',
  },
  {
    name: 'Orders',
    url: '/user/orders',
    icon: 'cil-list-numbered'
  },
  {
    name: 'Critiques',
    url: '/user/critiques',
    icon: 'icon-pencil'
  },
  {
    name: 'Profile',
    url: '/user/profile',
    icon: 'cil-group'
  },
  {
    name: 'Transaction',
    url: '/user/transaction',
    icon: 'cil-cash'
  },
];

import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'icon-speedometer',
  },
  {
    name: 'Orders',
    url: '/admin/orders',
    icon: 'cil-list-numbered',
  },
  {
    name: 'Critiques',
    url: '/admin/critiques',
    icon: 'icon-pencil'
  },
  {
    name: 'Blogs',
    url: '/admin/blog',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'All Blogs',
        url: '/admin/blog/all',
        icon: 'icon-puzzle',
        attributes: { "class": "pl-4" }
      },
      {
        name: 'Create Blog',
        url: '/admin/blog/create',
        icon: 'icon-puzzle',
        attributes: { "class": "pl-4" }
      }
    ]
  },
  {
    name: 'Testimonials',
    url: '/admin/charts',
    icon: 'icon-pie-chart'
  },
  {
    name: 'Packages',
    url: '/admin/package',
    icon: 'icon-cursor',
    children: [
      {
        name: 'All Packages',
        url: '/admin/package/all',
        icon: 'icon-cursor',
        attributes: { "class": "pl-4" }
      },
      {
        name: 'Create Package',
        url: '/admin/package/create',
        icon: 'icon-cursor',
        attributes: { "class": "pl-4" }
      }
    ]
  },

  {
    name: 'Services',
    url: '/admin/service',
    icon: 'icon-star',
    children: [
      {
        name: 'All Services',
        url: '/admin/service/all',
        icon: 'icon-star',
        attributes: { "class": "pl-4" }
      },
      {
        name: 'Create Service',
        url: '/admin/service/create',
        icon: 'icon-star',
        attributes: { "class": "pl-4" }
      }
    ]
  },
  {
    name: 'Resume Samples',
    url: '/admin/samples',
    icon: 'cil-list-numbered',
    children: [
      {
        name: 'All Categories',
        url: '/admin/samples/categories_list',
        icon: 'cil-list-numbered',
        attributes: { "class": "pl-4" }
      },
      {
        name: 'All Samples',
        url: '/admin/samples/samples_list',
        icon: 'cil-list-numbered',
        attributes: { "class": "pl-4" }
      },
      {
        name: 'Add New Sample',
        url: '/admin/samples/add_new_samples',
        icon: 'cil-list-numbered',
        attributes: { "class": "pl-4" }
      },
    ]
  },
  {
    name: 'Transaction',
    url: '/admin/transaction',
    icon: 'cil-cash'
  },
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './views/login/login.component';

const routes: Routes = [
  {
    path:"login",
    component:LoginComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminComponent,
    data: {
      title: 'Home'
    },
    canActivate:[AdminAuthGuard],
    children: [
      {
        path: 'critiques',
        loadChildren: () => import('./critique/critique.module').then(m => m.CritiqueModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)
      },
      {
        path: 'service',
        loadChildren: () => import('./service/service.module').then(m => m.ServiceModule)
      },
      {
        path: 'package',
        loadChildren: () => import('./package/package.module').then(m => m.PackageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

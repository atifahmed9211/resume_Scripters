import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { TransactionDetailComponent } from './transaction/transaction-detail/transaction-detail.component';
import { TransactionComponent } from './transaction/transaction.component';
import { UserAuthGuard } from './user-auth.guard';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: UserComponent,
    data: {
      title: 'Home'
    },
    canActivate: [UserAuthGuard],
    children: [
      {
        path: 'orders',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
      },
      {
        path: 'critiques',
        loadChildren: () => import('./critique/critique.module').then(m => m.CritiqueModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'transaction',
        component:TransactionComponent,
      },
      {
        path:"transaction/order/:id",
        component:TransactionDetailComponent,
        data:{
          title:"Transaction Detail"
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

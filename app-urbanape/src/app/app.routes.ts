import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { ShellComponent } from './pages/shell/shell';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { RegisterComponent } from './pages/admin/register/register';
import { UsersComponent } from './pages/admin/users/users';
import { EditUserComponent } from './pages/admin/edit-user/edit-user';
import { CardsComponent } from './pages/admin/cards/cards';
import { MyAccountComponent } from './pages/myaccount/myaccount';
import { MyCardsComponent } from './pages/mycards/mycards';
import { userGuard } from './guards/user.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Auth,
  },
  {
    path: 'admin',
    component: ShellComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/edit/:id',
        component: EditUserComponent,
      },
      {
        path: 'cards',
        component: CardsComponent,
      },
      {
        path: 'myaccount',
        component: MyAccountComponent,
      },
      {
        path: 'mycards',
        component: MyCardsComponent,
      },
    ],
  },
  {
    path: 'myaccount',
    component: ShellComponent,
    canActivate: [userGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MyAccountComponent,
      },
    ],
  },
  {
    path: 'mycards',
    component: ShellComponent,
    canActivate: [userGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MyCardsComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

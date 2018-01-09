import {Routes} from '@angular/router';
import {DemoBuildProfileComponent} from './demo/build-profile.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'build',
    pathMatch: 'full',
  }, {
    path: 'build',
    component: DemoBuildProfileComponent,
  },
];

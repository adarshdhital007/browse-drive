import { Routes } from '@angular/router';
import { GoogleDriveComponent } from './features/google-drive/google-drive.component';

import { IcloudComponent } from './features/icloud/icloud.component';
import { DXComponent } from './features/dropbox/dropbox.component';

export const routes: Routes = [
  { path: 'google', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'google', component: GoogleDriveComponent },
  { path: 'demo', component: DXComponent },
  { path: 'icloud', component: IcloudComponent },
];

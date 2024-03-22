import { Routes } from '@angular/router';
import { GoogleDriveComponent } from './features/google-drive/google-drive.component';
import { OnedriveComponent } from './features/dropbox/dropbox.component';
import { IcloudComponent } from './features/icloud/icloud.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'google', component: GoogleDriveComponent },
  { path: 'onedrive', component: OnedriveComponent },
  { path: 'icloud', component: IcloudComponent },
];

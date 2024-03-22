import { Routes } from '@angular/router';
import { GoogleDriveComponent } from './features/google-drive/google-drive.component';
import { DropBoxComponent } from './features/dropbox/dropbox.component';
import { IcloudComponent } from './features/icloud/icloud.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'google', component: GoogleDriveComponent },
  { path: 'dropbox', component: DropBoxComponent },
  { path: 'icloud', component: IcloudComponent },
];

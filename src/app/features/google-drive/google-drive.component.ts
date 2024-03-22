import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleService } from './google.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

declare const gapi: any;
declare const google: any;
declare const window: any;

@Component({
  standalone: true,
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.scss'],
  providers: [GoogleService],
  imports: [CommonModule, HttpClientModule],
})
export class GoogleDriveComponent implements OnInit, OnDestroy {
  loggedIn = false;
  pickerApiLoaded = false;
  accessToken: string | null = null;
  showBrowseButton = false;
  selectedFile: any;
  downloadLink: string;
  fileId: number;
  public destroy$: Subject<void> = new Subject<void>();

  clientId =
    '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com';
  redirectUri = 'https://browse-drive.vercel.app/google';
  scope = 'https://www.googleapis.com/auth/drive.file';
  responseType = 'code';
  state = 'state_parameter_passthrough_value';

  constructor(private gserv: GoogleService) {}
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    this.gserv
      .getAccessToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (accessToken) => {
          this.accessToken = accessToken;
          console.log('Access Token:', this.accessToken);
          this.loggedIn = true;
          this.showBrowseButton = true;
          this.loadPickerApi();
        },
        (error) => {
          console.error('Error getting access token:', error);
        }
      );
  }

  loginGoogle() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${this.scope}&response_type=${this.responseType}&state=${this.state}`;
    window.location.href = authUrl;
  }

  launchPicker() {
    this.createPicker({
      clientId: this.clientId,
      viewId: google.picker.ViewId.DOCS,
      origin: `${window.location.protocol}//${window.location.host}`,
      multiselect: false,
    }).then((data: any) => {
      console.log('Selected file:', data);
      this.fileId = data.id;
      this.selectedFile = data.file;
      this.downloadLink = `https://drive.google.com/uc?id=${this.fileId}&export=download`;
    });
  }

  async loadPickerApi() {
    await this.onApiLoad();
    this.pickerApiLoaded = true;
    console.log('Google Picker API loaded');
  }

  async onApiLoad() {
    return new Promise<void>((resolve) => {
      gapi.load('picker', {
        callback: resolve,
      });
    });
  }

  async createPicker(options: any) {
    return new Promise<any>((resolve) => {
      const picker = new google.picker.PickerBuilder()
        .addView(new google.picker.DocsView())
        .setOAuthToken(this.accessToken)
        .setCallback((data: any) => {
          if (
            data[google.picker.Response.ACTION] === google.picker.Action.PICKED
          ) {
            const selectedDoc = data[google.picker.Response.DOCUMENTS][0];
            let embedUrl = null;
            if (selectedDoc.mimeType === 'application/x-shellscript') {
              embedUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
                selectedDoc.url
              )}`;
            }
            resolve({ ...selectedDoc, embedUrl: embedUrl });
          }
        })
        .build();
      picker.setVisible(true);
    });
  }

  downloadFile() {
    console.log(this.fileId);
    this.downloadLink = `https://drive.google.com/uc?id=${this.fileId}&export=download`;
  }
}

import { Component, OnInit } from '@angular/core';
import { GoogleService } from './google.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
export class GoogleDriveComponent implements OnInit {
  loggedIn = false;
  pickerApiLoaded = false;
  accessToken: string | null = null;
  showBrowseButton = false;
  selectedFile: any;

  clientId =
    '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com';
  redirectUri = 'http://localhost:4200/google';
  scope = 'https://www.googleapis.com/auth/drive.file';
  responseType = 'code';
  state = 'state_parameter_passthrough_value';

  constructor(private gserv: GoogleService) {}

  ngOnInit() {
    this.gserv.getAccessToken().subscribe(
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
    }).then((data) => {
      console.log('Selected file:', data);
      this.selectedFile = data.file;
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
            resolve(data[google.picker.Response.DOCUMENTS][0]);
            console.log(data[google.picker.Response.DOCUMENTS][0]);
          }
        })
        .build();
      picker.setVisible(true);
    });
  }
}

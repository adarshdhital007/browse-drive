import { Component } from '@angular/core';
import { GoogleService } from './google.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

declare const gapi: any;
declare const google: any;

@Component({
  standalone: true,
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.scss'],
  imports: [HttpClientModule, CommonModule],
  providers: [GoogleService],
})
export class GoogleDriveComponent {
  loggedIn: boolean = false;
  pickerApiLoaded: boolean = false;
  accessToken!: string | null;
  showBrowseButton: boolean = false;

  constructor(private gserv: GoogleService) {
    this.loadPickerApi();
    this.gserv.getAccessToken().subscribe(
      (accessToken) => {
        this.accessToken = accessToken;
        console.log('Access Token:', this.accessToken);
        this.loggedIn = true; // Set loggedIn to true after getting the access token
        this.showBrowseButton = true; // Show the browse button after login
        this.loadPickerApi(); // Load picker API after login
      },
      (error) => {
        console.error('Error getting access token:', error);
      }
    );
  }
  clientId =
    '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com';
  redirectUri = '/google';
  scope = 'https://www.googleapis.com/auth/drive.file';
  responseType = 'code';
  state = 'state_parameter_passthrough_value';
  loginGoogle() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${this.scope}&response_type=${this.responseType}&state=${this.state}`;
    window.location.href = authUrl;
  }

  launchPicker() {
    this.createPicker({
      clientId:
        '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com',
      viewId: google.picker.ViewId.DOCS,
      origin: window.location.protocol + '//' + window.location.host,
      multiselect: false,
    }).then((data) => {
      console.log('Selected file:', data);
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

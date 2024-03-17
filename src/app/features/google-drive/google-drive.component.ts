import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login'; // Make sure to import GoogleLoginProvider
import { CommonModule } from '@angular/common';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GoogleService } from './google.service';

declare const google: any;
declare const gapi: any;

@Component({
  standalone: true,
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.scss'],
  imports: [CommonModule, GoogleSigninButtonModule],
  providers: [],
})
export class GoogleDriveComponent implements OnInit {
  user: any;
  loggedIn: boolean = false;
  pickerApiLoaded: boolean = false;

  constructor(private authService: SocialAuthService) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;

      if (this.loggedIn) {
        console.log(this.user.idToken);
        this.loadPickerApi();
      }
    });
  }

  async loadPickerApi() {
    await this.onApiLoad();
    this.pickerApiLoaded = true;
    console.log('Google Picker API loaded');
  }

  launchPicker() {
    if (!this.loggedIn || !this.pickerApiLoaded) {
      console.warn('User not logged in or Picker API not loaded');
      return;
    }

    this.createPicker({
      clientId:
        '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com',
      viewId: google.picker.ViewId.DOCS,
      origin: window.location.protocol + '//' + window.location.host,
      accessToken: this.user.idToken,
      multiselect: false,
    }).then((data) => {
      console.log('Selected file:', data);
    });
  }

  async onApiLoad() {
    return new Promise<void>((resolve) => {
      gapi.load('picker', {
        callback: resolve,
      });
    });
  }

  //Always generate the token from the api first, then only set the oAuthToken and it will work.

  async createPicker(options: any) {
    return new Promise<any>((resolve) => {
      const picker = new google.picker.PickerBuilder()
        .addView(new google.picker.DocsView())
        .setOAuthToken(
          'ya29.a0Ad52N398s1EUIFL2FXWyw49nCAmxdMGR6KD7dO6deqoelC-uTdmh7kMnMekaaR9zd8N6xs_HUeqz55vVahI7AOGFVrlTU-um2tVWOPxAJjLzJD1K_-K7Y8mzzlrig6SnL4qmcbtxR826tMNUoY8u67Ei2tVr93GnU0epaCgYKAVgSARESFQHGX2MihLMcIDYVTzZ2f-xvqmZ9Rw0171'
        )
        .setCallback((data: any) => {
          if (
            data[google.picker.Response.ACTION] === google.picker.Action.PICKED
          ) {
            resolve(data[google.picker.Response.DOCUMENTS][0]);
          }
        })
        .build();
      picker.setVisible(true);
    });
  }
}

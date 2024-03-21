import { Component, OnInit, OnDestroy } from '@angular/core';
import { dropboxConfig, DbxAuth } from '../../../../config';
import { Subscription } from 'rxjs';
import { AuthService } from './scripts/dropbox.service';
import { Router } from '@angular/router';
declare const Dropbox: any;
@Component({
  selector: 'app-onedrive',
  templateUrl: './onedrive.component.html',
  styleUrls: ['./onedrive.component.scss'],
})
export class OnedriveComponent implements OnInit, OnDestroy {
  public dbxAuth!: DbxAuth;
  private subscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.subscription = this.authService
      .getAuth()
      .subscribe((auth) => (this.dbxAuth = auth));

    if (!this.dbxAuth.isAuth) {
      const authUrl = this.router.url;
      const parameters = authUrl.split('#')[1] || '';
      if (parameters.length > 0) {
        const arrParams = parameters.split('&') || [];
        if (arrParams.length > 0) {
          const authObj: DbxAuth = { isAuth: false };
          for (let i = 0; i < arrParams.length; i++) {
            const arrItem = arrParams[i].split('=');
            switch (arrItem[0]) {
              case 'access_token':
                authObj.accessToken = arrItem[1];
                break;
              case 'token_type':
                authObj.tokenType = arrItem[1];
                break;
              case 'uid':
                authObj.uid = arrItem[1];
                break;
              case 'account_id':
                authObj.accountId = arrItem[1];
                break;
              default:
                break;
            }
          }

          if (
            authObj.accessToken &&
            authObj.tokenType &&
            authObj.uid &&
            authObj.accountId
          ) {
            authObj.isAuth = true;
            this.dbxAuth = authObj;
          }

          console.log('authObj', authObj);
        }
      }

      if (this.dbxAuth.isAuth) {
        this.authService.storeAuth(this.dbxAuth);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleAuthorization() {
    const urlAuth =
      `https://www.dropbox.com/oauth2/authorize?` +
      `client_id=${dropboxConfig.clientId}` +
      `&redirect_uri=${dropboxConfig.redirectUri}` +
      `&response_type=${dropboxConfig.responseType}`;
    window.location.href = urlAuth;
  }

  openDropboxChooser() {
    const options = {
      success: (files: any) => {
        console.log('Files selected:', files);
        // Handle selected files
      },
      cancel: () => {
        console.log('Chooser cancelled');
        // Handle cancellation
      },
      linkType: 'direct', // or 'preview'
      multiselect: true, // or false
      extensions: ['.pdf', '.doc', '.docx'], // allowed extensions
    };

    const button = Dropbox.createChooseButton(options);
    document.getElementById('container').appendChild(button);
  }
}

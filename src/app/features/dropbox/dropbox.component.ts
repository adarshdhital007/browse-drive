import { Component, OnInit, OnDestroy } from '@angular/core';
import { dropboxConfig, DbxAuth } from '../../../../config';
import { Subscription } from 'rxjs';
import { AuthService } from './scripts/dropbox.service';
import { Router } from '@angular/router';
declare const Dropbox: any;
@Component({
  selector: 'app-dropbox',
  templateUrl: './dropbox.component.html',
})
export class OnedriveComponent implements OnInit, OnDestroy {
  public dbxAuth!: DbxAuth;
  private subscription!: Subscription;
  fileUrl: string;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

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
        this.fileUrl = files.url;
      },
      cancel: () => {
        console.log('Chooser cancelled');
      },
      linkType: 'direct',
      multiselect: true,
      extensions: ['.pdf', '.doc', '.docx'],
    };

    const button = Dropbox.createChooseButton(options);
    document.getElementById('container').appendChild(button);
  }
}

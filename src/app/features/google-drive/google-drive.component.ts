import { Component } from '@angular/core';

declare const gapi: any;
declare const google: any;

@Component({
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.scss'],
})
export class GoogleDriveComponent {
  private accessToken: string | null =
    'AIzaSyD6W11hnCsm82Xb_CrNFjjx8cfEDQ6lH7k';

  openPicker() {
    this.instantiate();
  }

  onLoaded() {
    console.log('Google Picker loaded');
  }

  onCancel() {
    console.log('User canceled Google Picker');
  }

  onPicked(data: any) {
    console.log('Picked files:', data.docs);
  }

  private instantiate() {
    gapi.load('auth', { callback: this.onApiAuthLoad.bind(this) });
    gapi.load('picker');
  }

  private onApiAuthLoad() {
    const authToken = gapi.auth.getToken();

    if (authToken) {
      this.handleAuthResult(authToken);
    } else {
      gapi.auth.authorize(
        {
          client_id:
            '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com',
          scope: ['https://www.googleapis.com/auth/drive.file'],
          immediate: false,
        },
        this.handleAuthResult.bind(this)
      );
    }
  }

  private handleAuthResult(result: any) {
    if (result && !result.error) {
      this.accessToken = result.access_token;
      this.openDialog();
    }
  }

  private openDialog() {
    const picker = new google.picker.PickerBuilder()
      .setLocale('en')
      .setOAuthToken(this.accessToken || '')
      .setCallback(this.pickerResponse.bind(this))
      .setOrigin(window.location.protocol + '//' + window.location.host);

    picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);

    const docsView = new google.picker.DocsView().setIncludeFolders(true);
    const docsUploadView = new google.picker.DocsUploadView().setIncludeFolders(
      true
    );
    picker.addView(docsView);
    picker.addView(docsUploadView);

    picker.build().setVisible(true);
  }

  private pickerResponse(data: any) {
    gapi.client.load('drive', 'v2', () => {
      if (data.action === google.picker.Action.LOADED) {
        this.onLoaded();
      }
      if (data.action === google.picker.Action.CANCEL) {
        this.onCancel();
      }
      if (data.action === google.picker.Action.PICKED) {
        this.onPicked({ docs: data.docs });
      }
    });
  }
}

// import { Component } from '@angular/core';
// @Component({
//   selector: 'app-google-drive',
//   templateUrl: './google-drive.component.html',
//   styleUrls: ['./google-drive.component.scss'],
// })
// export class GoogleDriveComponent {
//   const SCOPES = 'https://www.googleapis.com/auth/drive.file';

//   CLIENT_ID = '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com';
//   API_KEY = 'AIzaSyD6W11hnCsm82Xb_CrNFjjx8cfEDQ6lH7k';

//   const APP_ID = '<YOUR_APP_ID>';

//   tokenClient: any;
//   accessToken: string | null = null;
//   pickerInited = false;
//   gisInited = false;

//   document.getElementById('authorize_button').style.visibility = 'hidden';
//   document.getElementById('signout_button').style.visibility = 'hidden';

//   /**
//    * Callback after api.js is loaded.
//    */
//   gapiLoaded() {
//     gapi.load('client:picker', initializePicker);
//   }

//   /**
//    * Callback after the API client is loaded. Loads the
//    * discovery doc to initialize the API.
//    */
//   async function initializePicker() {
//     await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
//     pickerInited = true;
//     maybeEnableButtons();
//   }

//   /**
//    * Callback after Google Identity Services are loaded.
//    */
//   gisLoaded() {
//     tokenClient = google.accounts.oauth2.initTokenClient({
//       client_id: '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com',
//       scope: 'https://www.googleapis.com/auth/drive.file',
//       callback: '', // defined later
//     });
//     gisInited = true;
//     maybeEnableButtons();
//   }

//   /**
//    * Enables user interaction after all libraries are loaded.
//    */
//   maybeEnableButtons() {
//     if (pickerInited && gisInited) {
//       document.getElementById('authorize_button').style.visibility = 'visible';
//     }
//   }

//   /**
//    * Sign in the user upon button click.
//    */
//   handleAuthClick() {
//     tokenClient.callback = async (response: any) => {
//       if (response.error !== undefined) {
//         throw response;
//       }
//       accessToken = response.access_token;
//       document.getElementById('signout_button')!.style.visibility = 'visible';
//       document.getElementById('authorize_button')!.innerText = 'Refresh';
//       await createPicker();
//     };

//     if (accessToken === null) {
//       // Prompt the user to select a Google Account and ask for consent to share their data
//       // when establishing a new session.
//       tokenClient.requestAccessToken({ prompt: 'consent' });
//     } else {
//       // Skip display of account chooser and consent dialog for an existing session.
//       tokenClient.requestAccessToken({ prompt: '' });
//     };
//   }

//   /**
//    * Sign out the user upon button click.
//    */
//   handleSignoutClick() {
//     if (accessToken) {
//       accessToken = null;
//       google.accounts.oauth2.revoke(accessToken);
//       document.getElementById('content')!.innerText = '';
//       document.getElementById('authorize_button')!.innerText = 'Authorize';
//       document.getElementById('signout_button')!.style.visibility = 'hidden';
//     }
//   }

//   /**
//    * Create and render a Picker object for searching images.
//    */
//   function createPicker() {
//     const view = new google.picker.View(google.picker.ViewId.DOCS);
//     view.setMimeTypes('image/png,image/jpeg,image/jpg');
//     const picker = new google.picker.PickerBuilder()
//       .enableFeature(google.picker.Feature.NAV_HIDDEN)
//       .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
//       .setDeveloperKey('AIzaSyD6W11hnCsm82Xb_CrNFjjx8cfEDQ6lH7k')
//       .setAppId(APP_ID)
//       .setOAuthToken(accessToken!)
//       .addView(view)
//       .addView(new google.picker.DocsUploadView())
//       .setCallback(pickerCallback)
//       .build();
//     picker.setVisible(true);
//   }

//   /**
//    * Displays the file details of the user's selection.
//    * @param {object} data - Containers the user selection from the picker
//    */
//   async function pickerCallback(data: any) {
//     if (data.action === google.picker.Action.PICKED) {
//       let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
//       const document = data[google.picker.Response.DOCUMENTS][0];
//       const fileId = document[google.picker.Document.ID];
//       console.log(fileId);
//       const res = await gapi.client.drive.files.get({
//         'fileId': fileId,
//         'fields': '*',
//       });
//       text += `Drive API response for the first document: \n${JSON.stringify(res.result, null, 2)}\n`;
//       window.document.getElementById('content').innerText = text;
//     }
//   }

// }

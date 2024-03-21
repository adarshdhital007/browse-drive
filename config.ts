export const dropboxConfig = {
  clientId: '1zb3qc8vte0pwoz',
  redirectUri: 'http://localhost:4200/onedrive',
  responseType: 'token',
  trustUrl: 'https://www.dropbox.com',
};

export const dropboxApi = {
  filesListFolderContinue:
    'https://api.dropboxapi.com/2/files/list_folder/continue',
  filesListFolderGetLatestCursor:
    'https://api.dropboxapi.com/2/files/list_folder/get_latest_cursor',
};

export interface DbxAuth {
  accessToken?: string;
  tokenType?: string;
  uid?: string;
  accountId?: string;
  isAuth?: boolean;
}

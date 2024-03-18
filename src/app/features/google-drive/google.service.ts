import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  constructor(private http: HttpClient) {}

  clientSecret = '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';
  redirectUri = 'http://localhost:4200/google';
  clientId =
    '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com';
  code!: string | null;

  codeExtractor() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedCode = urlParams.get('code');

    if (encodedCode) {
      this.code = decodeURIComponent(encodedCode);
      console.log('Code:', this.code);
    }
  }
  public getAccessToken(): Observable<string> {
    this.codeExtractor();

    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const body = {
      code: this.code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(tokenUrl, body, { headers }).pipe(
      map((response: any) => response.access_token),
      catchError((error) => {
        console.error('Error exchanging code for access token:', error);
        throw error; // Rethrow the error to be caught by the subscriber
      })
    );
  }
}

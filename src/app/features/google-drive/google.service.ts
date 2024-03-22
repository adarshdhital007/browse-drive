import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  constructor(private http: HttpClient) {}

  clientSecret = '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';
  redirectUri = 'https://browse-drive.vercel.app/google';
  clientId =
    '996313332086-t0e96n8s71mga0k254m48qirs77fjai9.apps.googleusercontent.com';
  code!: string | null;
  encodedCode!: string | null;

  codeExtractor() {
    let encodedCode: string | null = null;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      encodedCode = urlParams.get('code');
    }

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
        console.error('error for getting access token:', error);
        throw error;
      })
    );
  }
}

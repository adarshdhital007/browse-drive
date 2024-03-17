import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  constructor(private http: HttpClient) {}

  getAccessToken(): Promise<string> {
    const clientId = 'YOUR_CLIENT_ID';
    const clientSecret = 'YOUR_CLIENT_SECRET';
    const refreshToken = 'YOUR_REFRESH_TOKEN';
    const scope = 'https://www.googleapis.com/auth/drive'; // Adjust scope as needed

    const params = new URLSearchParams();
    params.set('client_id', clientId);
    params.set('client_secret', clientSecret);
    params.set('refresh_token', refreshToken);
    params.set('grant_type', 'refresh_token');
    params.set('scope', scope);

    return this.http
      .post<any>('https://oauth2.googleapis.com/token', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .toPromise()
      .then((response) => response.access_token)
      .catch((error) => {
        console.error('Error fetching access token:', error.message);
        return null;
      });
  }
}

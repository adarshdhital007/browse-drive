import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { DbxAuth } from '../../../../../config';
import { LocalStorageMethods } from '../../../../../utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dbxAuth: DbxAuth = { isAuth: false }; // Initialize dbxAuth here
  private objBehaviorSubject: BehaviorSubject<any>;

  constructor(private router: Router) {
    this.objBehaviorSubject = new BehaviorSubject(this.dbxAuth);

    const savedCredentials: DbxAuth =
      LocalStorageMethods.retrieve('dropexCredentials');
    if (savedCredentials) {
      this.storeAuth(savedCredentials);
    }
  }

  getAuth(): BehaviorSubject<DbxAuth> {
    return this.objBehaviorSubject;
  }

  storeAuth(inDbxAuth: DbxAuth) {
    this.dbxAuth = inDbxAuth;
    LocalStorageMethods.store('dropexCredentials', this.dbxAuth);
    return this.objBehaviorSubject.next(this.dbxAuth);
  }

  clearAuth() {
    this.dbxAuth = { isAuth: false }; // Reset dbxAuth
    LocalStorageMethods.clear();
    return this.objBehaviorSubject.next(this.dbxAuth);
  }

  canActivate(): boolean {
    if (!this.dbxAuth.isAuth) {
      this.router.navigate(['/auth:now']);
      return false;
    }
    return true;
  }
}

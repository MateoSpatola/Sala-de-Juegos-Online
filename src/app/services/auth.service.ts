import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, UserCredential } from '@angular/fire/auth';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);

  signUp(user: IUser): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password)
    .then(response => {
      return updateProfile(response.user, { displayName: user.name }).then(() => response);
    });
  }

  signIn(user: IUser): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  sendRecoveryEmail(user: IUser) {
    return sendPasswordResetEmail(this.auth, user.email);
  }

  signOut(): Promise<void> {
    return this.auth.signOut();
  }
}

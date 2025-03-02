import {Component, inject, Input} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../models/IUser';
import { NotificationService } from '../../../services/notification.service';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService);
  private _databaseService = inject(DatabaseService);

  @Input() passwordType: string = "password";
  hide: boolean = true;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  showOrHidePassword() : void {
    this.hide = !this.hide;
    this.passwordType = this.hide ? 'password' : 'text';
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      this._notificationService.showLoadingAlert('Iniciando sesión...');
      try {
        await this._authService.signIn(this.form.value as IUser);
        const data = {
          uid: this._authService.auth.currentUser?.uid,
          date: new Date()
        }
        this._databaseService.setDocument('logs_login', data);
        this.form.reset();
        this._notificationService.closeAlert();
        this._notificationService.routerLink('/home');
      } catch (error: any) {
        this._notificationService.closeAlert();
        if (error.code === 'auth/invalid-credential') {
          this._notificationService.showAlert('¡Error: Usuario y/o contraseña incorrectos!', 'error', 2000);
        } else {
          this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
        }
      }
    }
  }

  quickLogin(email: string, password: string): void {
    this.form.setValue({ email, password });
  }
}


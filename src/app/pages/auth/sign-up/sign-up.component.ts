import {Component, inject, Input} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../models/IUser';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService)

  @Input() passwordType: string = "password";
  hide: boolean = true;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])

  })

  showOrHidePassword() : void {
    this.hide = !this.hide;
    this.passwordType = this.hide ? 'password' : 'text';
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      this._notificationService.showLoadingAlert('Creando cuenta...');
      try {
        await this._authService.signUp(this.form.value as IUser);
        this.form.reset();
        this._notificationService.closeAlert();
        this._notificationService.showAlert('¡Cuenta creada!', 'success', 1000);
        this._notificationService.routerLink('/home');
      } catch (error: any) {
        this._notificationService.closeAlert();
        if (error.code === 'auth/email-already-in-use') {
          this._notificationService.showAlert('¡Error: El correo ya está registrado!', 'error', 2000);
        } else {
          this._notificationService.showAlert('¡Error: No se pudo crear la cuenta!', 'error', 2000);
        }
      }
    }
  }

}

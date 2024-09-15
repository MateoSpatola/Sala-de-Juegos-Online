import {Component, inject} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../models/IUser';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService)

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  async submit(): Promise<void> {
    if (this.form.valid) {
      this._notificationService.showLoadingAlert('Enviando correo...');
      try {
        await this._authService.sendRecoveryEmail(this.form.value as IUser);
        this.form.reset();
        this._notificationService.closeAlert();
        this._notificationService.showAlert('¡Correo enviado, revisa tu bandeja de entrada!', 'success', 2000);
        this._notificationService.routerLink('/login');
      } catch (error) {
        this._notificationService.closeAlert();
        this._notificationService.showAlert('¡Error: No se pudo enviar el correo!', 'error', 2000);
      }
    }
  }

}

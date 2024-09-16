import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '@angular/fire/auth';
import { MatIcon } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIcon,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private _authService = inject(AuthService);
  private _notificationService = inject(NotificationService);

  user?: User | null;
  isLoggedIn: boolean = false;

  ngOnInit() {
    this._authService.onAuthStateChanged(user => {
      this.user = user;
      this.isLoggedIn = !!user;
    });
  }

  async signOut() {
    try {
      await this._authService.signOut();
      this._notificationService.showAlert('¡Sesión cerrada!', 'success', 1000);
    } catch (error) {
      this._notificationService.closeAlert();
      this._notificationService.showAlert('¡Error: No se pudo cerrar sesión!', 'error', 1000);
    }
  }
}

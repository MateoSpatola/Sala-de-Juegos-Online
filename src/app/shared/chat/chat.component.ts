import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Unsubscribe, User } from '@angular/fire/auth';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatSidenavModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  
  private _authService = inject(AuthService);
  private _databaseService = inject(DatabaseService);
  private _notificationService= inject(NotificationService);

  private authSubscription?: Unsubscribe;
  subscription: Subscription | null = null;
  user?: User | null;
  isLoggedIn: boolean = false;
  message: string = '';
  messages: any[] = [];

  ngOnInit() {
    this.authSubscription = this._authService.auth.onAuthStateChanged(user => {
      this.user = user;
      this.isLoggedIn = !!user;
    })
    this.getMessages();
  }

  async sendMessage(): Promise<void> {
    const user = await this._authService.auth.currentUser;
    if (user) {
      const data = {
        uid: user.uid,
        username: user.displayName,
        message: this.message,
        date: new Date()
      }
      this._databaseService.setDocument('chat', data);
      this.message = '';
    }
  }

  getMessages() {
    const observable = this._databaseService.getDocument('chat');
    this.subscription = observable.subscribe((res: any[]) => {
      this.messages = res.sort((a, b) => a.date - b.date);
      this.messages.forEach(message => {
        message.date = this._databaseService.convertTimestampToDate(message.date);
      });
    });
  }

  showLockedMessage() {
    this._notificationService.showAlert('¡Error: Debe iniciar sesión para acceder al chat!', 'error', 2500);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.authSubscription) {
      this.authSubscription();
    }
  }

}

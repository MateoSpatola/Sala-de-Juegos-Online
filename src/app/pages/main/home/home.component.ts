import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { AuthService } from '../../../services/auth.service';
import { Unsubscribe, User } from '@angular/fire/auth';
import { MatIcon } from '@angular/material/icon';
import { ChatComponent } from "../../../shared/chat/chat.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatIcon,
    ChatComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private _authService = inject(AuthService);
  private authSubscription?: Unsubscribe;

  user?: User | null;
  isLoggedIn: boolean = false;

  ngOnInit() {
    this.authSubscription = this._authService.auth.onAuthStateChanged(user => {
      this.user = user;
      this.isLoggedIn = !!user;
    })
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription();
    }
  }
}

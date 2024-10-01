import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatComponent } from '../../../shared/chat/chat.component';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    ChatComponent
  ],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent {

}

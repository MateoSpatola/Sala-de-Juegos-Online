import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatComponent } from '../../../shared/chat/chat.component';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { firstValueFrom } from 'rxjs';

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

  http = inject(HttpClient);
  private _notificationService= inject(NotificationService);

  apiUrl: string = "https://clientes.api.greenborn.com.ar/public-random-word"

  message: string = "";
  life: number = 5;
  loading: boolean = false;
  word: string = "";
  gameOver: boolean = false;
  keysPressed: string[] = [];

  keyboard: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  async getRandomWord() {
    try {
      this.loading = true;
      const observable = this.http.get(this.apiUrl);
      const response: any = await firstValueFrom(observable);
      this.word = this.convertWord(response[0]);
      console.log(this.word);
    } 
    catch (error: any) {
      this._notificationService.showAlert('Error inesperado: ' + error.message, 'error', 2000);
    }
    finally {
      this.loading = false;
    }
  }

  convertWord(word: string): string {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  }

  handleKeyPress(key: string) {
    if (!this.word.includes(key)) {
      this.life--;
    }
    this.keysPressed.push(key);
    this.checkWinner();
  }

  checkWinner() {
    if (this.life == 0) {
      this.message = "¡PERDISTE! La palabra era: " + this.word;
      this.gameOver = true;
    }
    else if(this.word.split('').every(key => this.keysPressed.includes(key)))
    {
      this.message = "¡GANASTE!";
      this.gameOver = true;
    }
  }

  resetGame() {
    this.message = "";
    this.life = 5;
    this.word = "";
    this.gameOver = false;
    this.keysPressed = [];
  }
}

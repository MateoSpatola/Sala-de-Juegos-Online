import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { ChatComponent } from '../../../shared/chat/chat.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    ChatComponent
  ],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent {

  http = inject(HttpClient);
  private _notificationService= inject(NotificationService);

  apiUrl: string = "https://www.deckofcardsapi.com/api/deck/"

  deckOfCards: any = {};
  currentCard: any = {};
  previousCard: any = {};

  message: string = "";
  score: number = 0;
  life: number = 5;
  loading: boolean = false;

  ngOnInit() {
    this.getDeckOfCards();
  }

  async getDeckOfCards(decks: number = 1) {
    try {
      this.loading = true;
      const url = this.apiUrl + 'new/shuffle/?deck_count=' + decks;
      const observable = this.http.get(url);
      const response: any = await firstValueFrom(observable);
      this.deckOfCards = response;
    } 
    catch (error: any) {
      this._notificationService.showAlert('Error inesperado: ' + error.message, 'error', 2000);
    }
    finally {
      this.loading = false;
    }
  }

  async drawCards(cards: number = 1): Promise<void> {
    try {
      this.loading = true;
      const url = this.apiUrl + this.deckOfCards.deck_id + '/draw/?count=' + cards;
      const observable = this.http.get(url);
      const response: any = await firstValueFrom(observable);
      if (this.currentCard.cards) {
        this.previousCard = this.currentCard;
      }
      this.currentCard = response;
    } 
    catch (error: any) {
      this._notificationService.showAlert('Error inesperado: ' + error.message, 'error', 2000);
    }
    finally {
      this.loading = false;
    }
  }

  getCardValue(value: string): number {
    const cardValues: { [key: string]: number } = {
      "ACE": 1,
      "KING": 13,
      "QUEEN": 12,
      "JACK": 11
    };
    return cardValues[value] || parseInt(value);
  }

  async checkWinner(isHigher: boolean) {
    await this.drawCards();
    const currentValue = this.getCardValue(this.currentCard.cards[0].value);
    const previousValue = this.getCardValue(this.previousCard.cards[0].value);

    if (currentValue === previousValue) {
      this.message = `${currentValue} es igual que ${previousValue} ¡SAFASTE!`;
      return;
    }
  
    const isCorrect = (isHigher && currentValue > previousValue) || (!isHigher && currentValue < previousValue);
  
    if (isCorrect) {
      this.message = `CORRECTO: ${currentValue} es ${isHigher ? 'mayor' : 'menor'} que ${previousValue} :)`;
      this.score++;
    } else {
      this.message = `INCORRECTO: ${currentValue} no es ${isHigher ? 'mayor' : 'menor'} que ${previousValue} :(`;
      this.life--;
    }

    if (this.life == 0) {
      this.message = "¡Juego terminado! Puntaje final: " + this.score;
    }
  }

  async higher() {
    await this.checkWinner(true);
  }

  async lower() {
    await this.checkWinner(false);
  }

  async resetGame() {
    this.score = 0;
    this.life = 5;
    this.message = "";
    this.previousCard = {};
    this.currentCard = {};
    await this.getDeckOfCards();
  }
}

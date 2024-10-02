import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatComponent } from '../../../shared/chat/chat.component';

import { ApiPreguntadosService } from '../../../services/api-preguntados.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    ChatComponent
  ],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent {

  apiService = inject(ApiPreguntadosService);
  loading: boolean = false;
  cryptos: any;
  correctOption: any;
  options: any[] = [];
  counter: number = 1;
  score: number = 0;

  getQuestion() {
    this.correctOption = {};
    this.options = [];
    if (this.cryptos.length >= 4) {
      this.correctOption =  this.getRandomOptions(1)[0];
      const incorrectOptions = this.getRandomOptions(3);
      this.options = [this.correctOption, ...incorrectOptions];
      this.options = this.options.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }

  getRandomOptions(count: number): any[] {
    let options: any = [];
    while (options.length < count) {
      const randomIndex = Math.floor(Math.random() * this.cryptos.length);
      const option = this.cryptos[randomIndex];
      if (!options.includes(option)) {
        options.push(option);
        this.cryptos.splice(randomIndex, 1);
      }
    }
    return options;
  }

  async checkCorrectOption(option: any) {
    this.loading = true;
    if (this.correctOption == option) {
      this.score++;
    }
    this.counter++;
    await this.getQuestion();
    this.loading = false;
  }

  async startGame() {
    this.loading = true;
    this.score = 0;
    this.counter = 1;
    this.cryptos = await this.apiService.getAllCryptos();
    this.getQuestion();
    this.loading = false;
  }

  exitGame() {
    this.cryptos = null;
    this.correctOption = {};
    this.options = [];
    this.score = 0;
    this.counter = 1;
  }
}

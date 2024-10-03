import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatComponent } from '../../../shared/chat/chat.component';

@Component({
  selector: 'app-reflex',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    ChatComponent,
    NgStyle
  ],
  templateUrl: './reflex.component.html',
  styleUrl: './reflex.component.css'
})
export class ReflexComponent {
  gameStarted: boolean = false;
  score: number = 0;
  timeRemaining: number = 20;
  interval: any;
  targets: any[] = [];

  startGame(): void {
    this.gameStarted = true;
    this.score = 0;
    this.timeRemaining = 20;
    this.spawnTargets();
    
    this.interval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        clearInterval(this.interval);
        this.targets = [];
      }
    }, 1000);
  }

  spawnTargets(): void {
    const numberOfTargets = 3;
    this.targets = [];

    for (let i = 0; i < numberOfTargets; i++) {
      const newTarget = {
        top: Math.random() * 250,
        left: Math.random() * 350,
        visible: true
      };
      this.targets.push(newTarget);
    }

    setTimeout(() => {
      this.targets.forEach(target => target.visible = false);
      if (this.timeRemaining > 0) {
        setTimeout(() => this.spawnTargets(), 100);
      }
    }, 2000);
  }

  onTargetClick(target: any): void {
    this.score++;
    target.visible = false;
  }

  endGame(): void {
    clearInterval(this.interval);
    this.targets = [];
    this.gameStarted = false;
  }
}

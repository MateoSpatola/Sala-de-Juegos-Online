import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ApiPreguntadosService {

  http = inject(HttpClient);
  private _notificationService= inject(NotificationService);

  private apiUrl: string;

  constructor() {
    this.apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
  }

  async getAllCryptos() {
    try {
      const observable = this.http.get(this.apiUrl);
      const response: any = await firstValueFrom(observable);
      const cryptos: any = response.map((crypto: any) => ({
        name: crypto.name,
        image: crypto.image
      }));
      return cryptos;
    } 
    catch (error: any) {
      this._notificationService.showAlert('Error inesperado: ' + error.message, 'error', 2000);
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

const API_BASE_URL = 'http://localhost:5115';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly forecasts = signal<WeatherForecast[]>([]);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.http.get<WeatherForecast[]>(`${API_BASE_URL}/weatherforecast`).subscribe({
      next: (data) => this.forecasts.set(data),
      error: () => this.error.set(`Could not reach the API at ${API_BASE_URL}. Is the backend running?`)
    });
  }
}

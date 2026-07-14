import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface WeatherCard extends WeatherForecast {
  icon: string;
  tempClass: 'temp-cold' | 'temp-mild' | 'temp-hot';
  dayLabel: string;
}

const API_BASE_URL = 'http://localhost:5115';

const SUMMARY_ICONS: Record<string, string> = {
  Freezing: '❄️',
  Bracing: '🌬️',
  Chilly: '🥶',
  Cool: '🌤️',
  Mild: '⛅',
  Warm: '🌥️',
  Balmy: '🌞',
  Hot: '☀️',
  Sweltering: '🔥',
  Scorching: '🌋'
};

function demoForecasts(): WeatherForecast[] {
  const today = new Date();
  const days = [
    { offset: 1, summary: 'Cool', c: 14 },
    { offset: 2, summary: 'Mild', c: 19 },
    { offset: 3, summary: 'Warm', c: 24 },
    { offset: 4, summary: 'Balmy', c: 28 },
    { offset: 5, summary: 'Chilly', c: 8 }
  ];
  return days.map(({ offset, summary, c }) => {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    return {
      date: date.toISOString().slice(0, 10),
      temperatureC: c,
      temperatureF: Math.round(32 + c * 1.8),
      summary
    };
  });
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);

  private readonly forecasts = signal<WeatherForecast[]>([]);
  protected readonly loading = signal(true);
  protected readonly usingDemoData = signal(false);

  protected readonly cards = computed<WeatherCard[]>(() =>
    this.forecasts().map((forecast) => ({
      ...forecast,
      icon: SUMMARY_ICONS[forecast.summary] ?? '🌡️',
      tempClass: forecast.temperatureC <= 0 ? 'temp-cold' : forecast.temperatureC <= 25 ? 'temp-mild' : 'temp-hot',
      dayLabel: new Date(forecast.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    }))
  );

  constructor() {
    this.http.get<WeatherForecast[]>(`${API_BASE_URL}/weatherforecast`).subscribe({
      next: (data) => {
        this.forecasts.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.forecasts.set(demoForecasts());
        this.usingDemoData.set(true);
        this.loading.set(false);
      }
    });
  }
}

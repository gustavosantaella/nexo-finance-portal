import { Component, signal, OnInit } from '@angular/core';
import { inject } from '@vercel/analytics';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  protected readonly title = signal('nexo-finance-portal');

  ngOnInit(): void {
    // Initialize Vercel Web Analytics
    // This tracks page views and user interactions
    inject();
  }
}

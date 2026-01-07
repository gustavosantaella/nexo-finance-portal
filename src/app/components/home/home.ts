import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {
  showIosModal = false;

  toggleIosModal() {
    this.showIosModal = !this.showIosModal;
  }
}

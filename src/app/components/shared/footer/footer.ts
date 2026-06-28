import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="ff-footer">
      <span class="ff-footer-text">© 2025 FastFood</span>
      <span class="ff-footer-text">Sva prava zadržana</span>
    </footer>
  `,
})
export class FooterComponent {}

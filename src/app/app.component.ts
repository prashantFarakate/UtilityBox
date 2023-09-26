import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IDPUtils';

  // to clear the session storage
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    sessionStorage.clear();
  }
}

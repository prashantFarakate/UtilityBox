import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  createTemplate() {
    // alert("image clicked")
    this.router.navigate(['/create-template']);
  }

  goToComparator(){
    window.open("https://text-comparator.web.app/", "_self");
  }

}

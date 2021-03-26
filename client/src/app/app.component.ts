import {Component, OnInit} from '@angular/core';
import {AuthService} from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  //удаляем app.component.html (изначальный темплайт)
  //и здесь меняем свойство с templateUrl на template
  // templateUrl: './app.component.html',
  //для рендера по роутам (по url)
  template: '<router-outlet></router-outlet>',
  //удаляем с файлом
  //styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {
  }
  ngOnInit(): void {
    const potentialToken = localStorage.getItem('auth-token')
    if(potentialToken !== null) {
      this.auth.setToken(potentialToken)
    }
  }
}

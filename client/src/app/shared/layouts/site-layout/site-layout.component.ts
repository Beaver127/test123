import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})

//AfterViewInit - добавляет метод который отслеживает когда js отрисует
//html и затем можно инициализировать что то в js
export class SiteLayoutComponent implements AfterViewInit {

  //делаем ссылку на нужный объект который мы хотим инициализировать и с ним работать
  //после загрузки страницы помечаем в параметрах блока #floating
  @ViewChild('floating') floatingRef : ElementRef
  links = [
    {url: "/overview", name: "Обзор"},
    {url: "/analytics", name: "Аналитика"},
    {url: "/history", name: "История"},
    {url: "/order", name: "Добавить заказ"},
    {url: "/categories", name: "Ассортимент"}
  ]
  //метод после отрисовки контента
  ngAfterViewInit(): void {
    //инициализируем кнопку с помощью библиотеки материалайз
    MaterialService.initializeFloatingButton(this.floatingRef)
  }
  //при нажатии на выход
  logout(event: Event) {
    //отмена переадрисации по ссылке
    event.preventDefault()
    //чистка localStorage и токена
    this.auth.logout()
    //редирект на логин
    this.router.navigate(['/login'])
  }
  //инджектим сервис для работы с входом и роутер для редиректов
  constructor(private auth: AuthService,
              private router: Router) { }

}

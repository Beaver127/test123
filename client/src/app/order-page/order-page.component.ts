import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})

//AfterViewInit - для работы с DOM деревом после загрузки DOM дерева \ всех компонентов
//OnInit - после инициализации компонента
//OnDestroy - после цничтожении компонента
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  //modalRef - #modal(order-page.component.html)
  @ViewChild('modal') modalRef: ElementRef
  //переменная для обозначения основная ли это страница с каталогом всех продуктов
  //или отдельная страница с заказов определённого продукта
  //order - каталог продуктво для заказа
  //order:id - определённая страница
  isRoot: boolean
  modal: MaterialInstance
  pending = false
  oSub: Subscription

  //router - инджектируем для работы с url
  constructor(private router : Router,
              public orderService: OrderService,
              private order : OrdersService) { }

  ngOnInit(): void {
    //определение какая страница
    this.isRoot = this.router.url === "/order"
    //подписываемся на измение url адреса
    this.router.events.subscribe((event) => {
      //помогает для производительности
      //так как мы подписалисьна большое множество событий мы делаем проверку на
      //одно событие для производительности
      if(event instanceof  NavigationEnd) {
        this.isRoot = this.router.url === "/order"
      }
    })
  }
  ngOnDestroy(): void {
    //уничтожаем модальное окно
    this.modal.destroy()
    if(this.oSub) {
      this.oSub.unsubscribe()
    }
  }
  //после иницализации компонета \ инициализируем через материал сервис модальное окно
  ngAfterViewInit(): void {
    //modalRef - #modal(order-page.component.html)
    this.modal = MaterialService.initModal(this.modalRef)
  }
  open() {
    //при клике открываем модальное окно оформления заказа
    this.modal.open()
  }
  close() {
    //закрываем модальное окно оформления заказа
    this.modal.close()
  }
  submit() {
    this.pending = true
    this.modal.close()
    const order: Order = {
      //ыва
      list: this.orderService.list.map(item => {
        delete item._id
        return item
      })
    }

    this.oSub = this.order.create(order).subscribe(newOrder => {
      MaterialService.toast(`Заказ №${newOrder.order} был добавлен.`)
      this.orderService.clear()
    },
      error => MaterialService.toast(error.error.message),
      () => {
        this.pending = false
      }

    )
  }

  removePosition(orderPosition : OrderPosition) {
    this.orderService.remove(orderPosition)
  }
}

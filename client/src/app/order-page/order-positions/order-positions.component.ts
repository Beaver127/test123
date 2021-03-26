import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PositionsService} from "../../shared/services/positions.service";
import {Observable} from "rxjs";
import {Position} from "../../shared/interfaces";
import {map, switchMap} from "rxjs/operators";
import {OrderService} from "../order.service";
import {MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>

  constructor(private route: ActivatedRoute, private positionsService: PositionsService,
              private order: OrderService) { }

  ngOnInit(): void {
    //с помощью pipe для асинхронной работы с потоком информации
    //switchMap - пробегаемся по массиву
    //map - пробегаемся по массиву и сетаем значение выбранных продуктов как 1
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params : Params) => {
            return this.positionsService.fetch(params['id'])
          }
        ),
        map(
          (positions : Position[]) => {
           return positions.map(position => {
              position.quantity = 1
              return position
            })
          }
        )
      )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Добавлено х${position.quantity}`)
    this.order.add(position)
  }

}

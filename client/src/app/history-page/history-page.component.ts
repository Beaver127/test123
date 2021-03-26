import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef : ElementRef

  tooltip: MaterialInstance
  isFilterVisible = false
  //isFilterVisible : boolean
  //для загрузить ещё
  loading = false
  //для изначальной загрузки или фильтра
  reloading = false
  oSub : Subscription
  offset = 0
  limit = STEP
  orders: Order[] = []
  noMoreOrders = false
  filter : Filter


  constructor(private ordersService : OrdersService) { }

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }

  private fetch() {
    // const params = {
    //   offset: this.offset,
    //   limit: this.limit
    // }
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })


    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders)
      this.noMoreOrders = orders.length < 1
      this.loading = false
      this.reloading = false
    })
  }

  ngOnDestroy(): void {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }
  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }
  applyFilter(filter : Filter) {
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
  }

  isFiltered() : boolean {
    //если filter будет пустым то при вызове функции полетит приложение
    //поэтому нужно определить инициализирован ли не равняется ли undefined
    if(this.filter) {
      return Object.keys(this.filter).length !== 0
    } else {
      //undefined
      console.log(this.filter)
      return false
    }
  }
}

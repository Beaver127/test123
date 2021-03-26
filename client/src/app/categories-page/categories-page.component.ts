import { Component, OnInit } from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {Category} from "../shared/interfaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {


  categories$: Observable<Category[]>

  constructor(private categoriesService : CategoriesService) { }

  ngOnInit(): void {
    //при инициализации категории компонента берём данные с сервера
    this.categories$ = this.categoriesService.fetch()
  }

}


// import { Component, OnInit } from '@angular/core';
// import {CategoriesService} from "../shared/services/categories.service";
// import {Category} from "../shared/interfaces";
//
// @Component({
//   selector: 'app-categories-page',
//   templateUrl: './categories-page.component.html',
//   styleUrls: ['./categories-page.component.css']
// })
// export class CategoriesPageComponent implements OnInit {
//  //один из вариантов добавления лоадера
//  //флаг для лоадера
//   loading = false
//   categories: Category[] = []
//
//   constructor(private categoriesService : CategoriesService) { }
//
//   ngOnInit(): void {
//    //включаем лоадер
//     this.loading = true
//     this.categoriesService.fetch().subscribe(categories => {
//       //выключение лоадера
//       this.loading = false
//       this.categories = categories
//     })
//   }
//
// }

import {NgModule} from '@angular/core'
//для навигации среди страниц (роутинг)
import {RouterModule, Routes} from "@angular/router"
//импортируем компонент логина
import {LoginPageComponent} from "./login-page/login-page.component";
//ипорт двух основных разметок это контент сайта и вход в систему
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";


import {RegisterPageComponent} from "./register-page/register-page.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {OverviewPageComponent} from "./overview-page/overview-page.component";
import {AnalyticsPageComponent} from "./analytics-page/analytics-page.component";
import {HistoryPageComponent} from "./history-page/history-page.component";
import {OrderPageComponent} from "./order-page/order-page.component";
import {CategoriesPageComponent} from "./categories-page/categories-page.component";
import {CategoriesFormComponent} from "./categories-page/categories-form/categories-form.component";
import {OrderCategoriesComponent} from "./order-page/order-categories/order-categories.component";
import {OrderPositionsComponent} from "./order-page/order-positions/order-positions.component";



//после : указываем тип массива (TypeScript)
const routes: Routes = [
  // {
  //обычный роут
  //   path:'login', component: LoginPageComponent
  // },
  {
    //путь отностительный не указываем так как будут дети которые относятся к этой разметке
    //и будут иметь свой путь
    path:'', component: AuthLayoutComponent, children: [
      //изначально будет переходить на страницу входа именно по пустой строке
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}
    ]
  },
  {
    //canActivate это массив для защиты роутинга \
    //и здесь перечисляються классы которые делают проверку на возможность предоставления доступа
    //пользователю AuthGuard - проверяет на то авторизован ли пользователь в системе
    //если нет пересылает его на страницу входа

    //роуты для контент части сайта
    path:'', component: SiteLayoutComponent, canActivate: [AuthGuard] , children: [
      {path: 'overview', component: OverviewPageComponent},
      {path: 'analytics', component: AnalyticsPageComponent},
      {path: 'history', component: HistoryPageComponent},
      //для заказов \ childred - указываем под роуты на которых показываем тот или иной
      //компонент
      {path: 'order', component: OrderPageComponent, children: [
        //категории продуктов
          {path: "", component: OrderCategoriesComponent},
        //страница заказа продукта
          {path: ":id", component: OrderPositionsComponent},
        ]},
      //получение всех категорий
      {path: 'categories', component: CategoriesPageComponent},
      //создание новой категории
      {path: 'categories/new', component: CategoriesFormComponent},
      //получение категории по id
      {path: 'categories/:id', component: CategoriesFormComponent},
    ]
  }
]

@NgModule({
  imports: [
    //делаем концфигурацию над роутером
    RouterModule.forRoot(routes)
  ],
  exports: [
    //сконфигурированый роутер експортируем
    RouterModule
  ]
})

export class AppRoutingModule {

}

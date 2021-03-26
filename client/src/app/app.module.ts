//главный файл
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//импортируем роутер
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { CategoriesFormComponent } from './categories-page/categories-form/categories-form.component';
import { PositionsFormComponent } from './categories-page/categories-form/positions-form/positions-form.component';
import { OrderCategoriesComponent } from './order-page/order-categories/order-categories.component';
import { OrderPositionsComponent } from './order-page/order-positions/order-positions.component';
import { HistoryListComponent } from './history-page/history-list/history-list.component';
import { HistoryFilterComponent } from './history-page/history-filter/history-filter.component';

@NgModule({
  declarations: [
    //подключаемые компоненты сайта
    //иногда нужно декларировать они компоненты раньше других (могут быть ошибки)
    SiteLayoutComponent,
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    RegisterPageComponent,
    OverviewPageComponent,
    AnalyticsPageComponent,
    HistoryPageComponent,
    OrderPageComponent,
    CategoriesPageComponent,
    LoaderComponent,
    CategoriesFormComponent,
    PositionsFormComponent,
    OrderCategoriesComponent,
    OrderPositionsComponent,
    HistoryListComponent,
    HistoryFilterComponent
  ],
  imports: [
    BrowserModule,
    //ипортируем сюда роутер
    AppRoutingModule,
    //работы с формами
    ReactiveFormsModule,
    //для работы с формами
    FormsModule,
    //для асинхронных запросов
    HttpClientModule
  ],

  //дополнительные подключаемые модули
  //только так можно регистрировать интерсептор
  providers: [
    {
      //константа для определения объявления интерсептора
      provide: HTTP_INTERCEPTORS,
      multi: true,
      //наш класс
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


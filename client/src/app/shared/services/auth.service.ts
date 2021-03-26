import {Injectable} from "@angular/core";
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";


//для того чтобы объявлять в конструкторе классса определённый объекты
@Injectable({
  //автоматически регистрируем сервис
  providedIn: "root"
})
export class AuthService {

  //токен
  private token = null;


  //при создании класс инициализируем и берём объект http для
  //асинхронных запросов на серв из библиотеки
  constructor(private http: HttpClient) {

  }
  //регистрация
  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register',user)
  }
  //вход
  login(user: User): Observable<{token: string}> {
    //pipe - выполнение по очереди определенных асинхронных функций
   return this.http.post<{token: string}>("/api/auth/login",user)
     //после получения токена авторизации с сервера сетаем его в
     //localStorage откуда после будет его брать ели он есть
     //tap() - шаг в котопром мы объявляем стрелочную функцию
     //через запятую добавляем новые шаги
     .pipe(
       tap(
         ({token}) => {
           //добавляем в локал сторедж токен
           localStorage.setItem('auth-token', token)
           this.setToken(token)
         }
       )
     )
  }
  //сетер токена
  setToken(token: string) {
    this.token = token
  }
  //получение токена
  getToken() : string {
    return this.token
  }
  //проверка авторизован ли
  isAuthenticated(): boolean {
    //приводим к булеву значению
    return !!this.token
  }
  //выход из системы
  logout() {
    this.setToken(null)
    localStorage.clear()
  }
}

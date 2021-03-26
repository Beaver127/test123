//создаем interceptor перехватчик который бдует делать проверку при каждом запросе есть ли токен
//авторизации \ регистраруется он в app.module.ts в массиве providers[]
//и добавляет в headers токен
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
//для того чтобы был интерсептором
export class TokenInterceptor implements HttpInterceptor{
  constructor(private auth: AuthService, private router: Router) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    //авторизован ли
    if(this.auth.isAuthenticated()) {

      //присваиваем точно такую же копию (для предовращение мутации)

      req = req.clone({
        setHeaders: {

          Authorization: this.auth.getToken()
        }
      })
    }
    //возвращаем продолжение выполнения реквеста
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => this.handleAuthError(error)
      )
    )
  }
  //метод обработки ошибки для авторизации по токену
  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    //если у токена закончилось время актуальности
    if(error.status === 401) {
      //направляем на эту страницу с параметром ошибки
      this.router.navigate(['/login'], {
        queryParams: {
          sessionFailed: true
        }
      })
    }
    return throwError(error)
  }
}

import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: "root"
})

//делаем из класса Guard
export class AuthGuard implements CanActivate, CanActivateChild{
  constructor(private auth: AuthService,
              private router: Router) {
  }
  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    //проверка на авторизацию
    if(this.auth.isAuthenticated()) {
      return of(true)
    } else {
      //отправляем на страницу входа
      this.router.navigate(['/login'], {
        queryParams: {
          accessDenied: true
        }
      })
      return of(false)
    }
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
    return this.canActivate(route,state)
  }
}

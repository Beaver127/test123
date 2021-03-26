import {Component, OnDestroy, OnInit} from '@angular/core';
//валидация \ формы
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  //для проблемы с утечкой памяти
  aSub: Subscription


  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    //создаем значения формы
    this.form = new FormGroup({
      //в массиве передаем валидатор отправки формы
      email: new FormControl(null, [Validators.required,Validators.email]),
      password: new FormControl(null, [Validators.required,
        Validators.minLength(5)])

    })

    this.route.queryParams.subscribe((params: Params) => {
      if(params['registered'] === "true") {
        //есть токен
        MaterialService.toast("теперь можно зайти в систему")
        //теперь можно зайти в систему
      } else if(params['accessDenied']) {
        //нет токена
        MaterialService.toast("для начала авторизуйтесь")
        //для начала авторизуйтесь
      } else if(params['sessionFailed']) {
        //время актуальности токена закончилось
        MaterialService.toast("пожалуйста авторизуйтесь снова")
      }
    })
  }

  //уничтожение копонента login
  ngOnDestroy() {
    //очистка
    if(this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    //отключаем форму на время отправки данных на серв
    this.form.disable()
    // const user = {
    //   email: this.form.value.email,
    //   password: this.form.value.password
    // }
    // this.auth.login(user)

    //замена коду выше
    this.aSub = this.auth.login(this.form.value).subscribe(
      //после входа отправляем на страницу overview
      () => {this.router.navigate(['/overview'])},
      error => {
        MaterialService.toast(error.error.message)
        //включаем форму при возникновении ошибки
        this.form.enable()
      }
    )
  }

}

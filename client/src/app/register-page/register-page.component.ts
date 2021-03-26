import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MaterialService} from "../shared/classes/material.service";
//компонент логики регистрации
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  //объявляем переменную формы
  form: FormGroup
  //переменная для очистки событий
  aSub: Subscription
  //инджектим
  constructor(private auth: AuthService,
              private router: Router) { }

  //при создании компонента
  ngOnInit(): void {
    //создаем значения формы
    this.form = new FormGroup({
      //в массиве передаем валидатор для полей формы

      //проверка на емаил и существование
      email: new FormControl(null, [Validators.required,Validators.email]),
      //проверка на существование и минимальный размер
      password: new FormControl(null, [Validators.required,
        Validators.minLength(5)])

    })
  }

  //при уничтожении компонента
  ngOnDestroy(): void {
    //очистка от неиспользуемого события
    if(this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  //при отправки данных на сервер
  onSubmit() {
    //отключаем форму на время отправки данных на сервер
    this.form.disable()
    //присваиваиваем событие объекту для очистки от события
    //в функцию для регистрации передаем все данные с формы и
    //подписываемся на этот асинхронный запрос чтобы после
    //перенаправить пользователя на страницу входа и указываем параметр как зарегистрирован
    //указываем это в объекте queryParams
    this.aSub = this.auth.register(this.form.value).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        })
      },
      //в случае ошибки выводим в консоль и
      //делаем форму отправки данных снова активной
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}

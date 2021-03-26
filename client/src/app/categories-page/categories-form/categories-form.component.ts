import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {MaterialService} from "../../shared/classes/material.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})

//форма редактирования фотки и названия категории
export class CategoriesFormComponent implements OnInit {

  //определяем инпут (название категории)
  @ViewChild('input') inputRef : ElementRef
  //создаем ли новый продукт
  isNew = true
  //переменная для файла
  image: File
  //превью
  imagePreview
  //реактивная форма
  form: FormGroup
  //категория
  category: Category



  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }

  ngOnInit(): void {
    //инициализируем поля реактивной формы при инициализации компонента
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    //закрываем доступ к редактированию
    this.form.disable()

    this.route.params.pipe(
        switchMap(
      (params: Params) => {
        if(params['id']) {
          this.isNew = false
          return this.categoriesService.getById(params['id'])
        }

        return of(null)
      }
    )
    )
      .subscribe(
        (category : Category) => {
          if(category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => {MaterialService.toast(error.error.message)}
      )

  }

  deleteCategory() {
    const decision = window.confirm(`Вы уверены, что хотите удалить категорию "${this.category.name}"`)

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  onSubmit() {
    let obs$
    this.form.disable()

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Изменения сохранены.')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
  triggerClick() {
    this.inputRef.nativeElement.click()
  }
  //при изменение
  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }

}

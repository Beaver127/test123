import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category, Message} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
//сервис для работы с категориями
export class CategoriesService {
  constructor(private http:HttpClient) {
  }
  //делаем ajax запрос на сервер и получаем стрим данных типа массива категорий
  fetch() : Observable<Category[]> {
    return this.http.get<Category[]>("/api/category")
  }
  //получаем категорию по id
  getById(id: string) : Observable<Category> {
    return this.http.get<Category>(`/api/category/${id}`);
  }
  //создание категории
  create(name: string, image?: File): Observable<Category> {
    const fd = new FormData()

    if (image) {
      //1 - название передаваемого элемента
      //2 - blob(файл, картинка)
      //3 - имя файла
      fd.append('image', image, image.name)
    }
    //1 - название передаваемого элемента
    //2 - значение
    fd.append('name', name)

    return this.http.post<Category>('/api/category', fd)
  }
  //обновление категории
  update(id: string, name: string, image?: File): Observable<Category> {
    const fd = new FormData()

    if (image) {
      fd.append('image', image, image.name)
    }
    fd.append('name', name)

    return this.http.patch<Category>(`/api/category/${id}`, fd)
  }

  //удаление категории по id
  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/category/${id}`)
  }
}

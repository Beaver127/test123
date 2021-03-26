import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Message, Position} from '../interfaces'

//инджектим
//providedIn: 'root' - регистрируем
@Injectable({
  providedIn: 'root'
})

export class PositionsService {
  //инджектим для запросов на сервер
  constructor(private http: HttpClient) {
  }

  //получение позиции по id
  fetch(categoryId: string): Observable<Position[]> {
    return this.http.get<Position[]>(`/api/position/${categoryId}`)
  }

  //создание позиции
  create(position: Position): Observable<Position> {
    return this.http.post<Position>('/api/position', position)
  }

  //обновление позиции
  update(position: Position): Observable<Position> {
    return this.http.patch<Position>(`/api/position/${position._id}`, position)
  }

  //удаление позиции по id
  delete(position: Position): Observable<Message> {
    return this.http.delete<Message>(`/api/position/${position._id}`)
  }
}

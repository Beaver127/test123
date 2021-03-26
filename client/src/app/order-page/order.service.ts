import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../shared/interfaces";


@Injectable(
  {providedIn:'root'}
)

//сервис
export class OrderService{

  //список всех заказов
  public list : OrderPosition[] = []
  //общая цена
  public price = 0



  add(position: Position) {
    //предовращение мутаций \ копируем в новый объект
    const orderPosition : OrderPosition = Object.assign({},{
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })

    //пытаемся найти в заказе продукт
    const candidate = this.list.find(p => p._id === position._id)

    //если такой продукт уже есть в заказе то увеличиваем кол продуктов
    if(candidate) {
      candidate.quantity += orderPosition.quantity
    } else {
      //иначе просто добавляем новый продукт
      this.list.push(orderPosition)
    }

    //пересчёт цены
    this.computePrice()
  }

  private computePrice() {
    //total - число которое сохраняется при каждом шаге по элементам массива
    //item - текущий элемент
    this.price = this.list.reduce((total,item) => {
      //к текущей сумме прибавляем \ умножение цены продукта на кол(сколько его выбрали)
      return total += item.quantity * item.cost
    }, 0)

  }



  remove(orderPosition : OrderPosition) {

    //получаем индекс нужного нам элемента по id
    const idx = this.list.findIndex(p => p._id === orderPosition._id)

    //удаляем из массива по индексу нужный элемент
    this.list.splice(idx,1)

    //пересчёт цены
    this.computePrice()
  }
  clear() {
    this.price = 0
    this.list = []
  }

}


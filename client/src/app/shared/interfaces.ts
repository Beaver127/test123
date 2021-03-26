
//Интерфейсы нужны для придания объектам определенного типа
export interface User {
  //строка емейл с типом данных string
  email: string
  password: string
}

export interface Message {
  message: string
}

export interface Category {
  name: string
  //? - обозгначаем что не обязателен параметр
  //некоторые параметры не зависят от фронта а от бекенда
  imageSrc?: string
  user?: string
  _id?: string
}

export interface Position {
  _id?: string
  name: string
  cost: number
  user?: string
  category: string
  quantity?: number
}

//заказ
export interface Order {
  date?: Date
  order?: number
  user?: string
  //продукты
  list: OrderPosition[]
  _id?: string
}

//продукт в заказе
export interface OrderPosition {
  name: string
  cost: number
  quantity: number
  _id?: string
}

export interface Filter {
  start?: Date,
  end?: Date,
  order?: number
}

export interface OverviewPage {
  orders : OverviewPageItem,
  gain : OverviewPageItem
}

export interface OverviewPageItem {
  percent: number,
  compare: number,
  yesterday : number,
  isHigher : boolean
}

export interface AnalyticsPage {
  average: number,
  chart : AnalyticsPageItem []
}

export interface AnalyticsPageItem {
  gain: number,
  order: number
  label: string
}

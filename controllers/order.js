const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

//(GET) http://localhost:5000/api/order?offset=2&limit=5
module.exports.getAll = async function (req,resp) {
    const query = {
        user: req.user.id
    }
    //выгребаем по отношению указнной дате либо те у которых дата меньше или больше данного значения
    //которое мы передали для сортировки

    //Дата старта (проверяем все даты которые больше или равны текущему значению если есть поле start)
    if(req.query.start) {
        query.date = {
            //больше или равно
            $gte: req.query.start
        }
    }
    //Для конца
    if(req.query.end) {
        if(!query.date) {
            query.date = {}
        }
        //меньше ли
        query.date['$lte'] = req.query.end
    }
    //если хотим взять объект по порядку
    if(req.query.order) {
        query.order = +req.query.order
    }
    try {
        const orders = await Order
            .find(query)
            //сортируем по дате добавляения в бд
            .sort({date: -1})
            .skip(+req.query.offset)
            //лимит на взятие объектов
            .limit(+req.query.limit)

        resp.status(200).json(orders)
    } catch (e) {
        errorHandler(resp, e)
    }
}
module.exports.create = async function (req,resp) {
    try {
        const lastOrder = await Order
            //находим одного пользователся по айдишнику
            .findOne({user: req.user.id})
            //сортируем самый последний заказ по дате заказа
            .sort({date: -1})
        //переменная порядка заказов
        const maxOrder = lastOrder ? lastOrder.order : 0
        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save()
        resp.status(201).json(order)
    } catch (e) {
        errorHandler(resp, e)
    }
}
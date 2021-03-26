const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function (req,resp) {
    try {
        //получаем все заказы и сортируем от старых к новым (масив)
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        //конструктор момента даёт текущий день а мы вичитаем один день и получаем прошлый день
        //если вернёт undefined то возращаем пустой массив
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []


        //количество заказов вчера
        const yesterdayOrdersNumber = yesterdayOrders.length
        //количество заказов
        const totalOrdersNumber = allOrders.length
        //количество дней
        const daysNumber = Object.keys(ordersMap).length
        //заказов в день
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
        //процент для кол-ва заказов
        // ((заказов вчера / кол-ва заказов в день) - 1) * 100
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)
        //общая выручка
        const totalGain = calculatePrice(allOrders)
        //выручка в день
        const gainPerDay = totalGain / daysNumber
        //выручка за вчера
        const yesterdayGain = calculatePrice(yesterdayOrders)
        //процент выручки
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
        //сравнение выручки
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        //Сравнение кол-ва заказов
        const compareOrdersNumber = (yesterdayOrders - ordersPerDay).toFixed(2)

        resp.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareOrdersNumber),
                yesterday: +yesterdayOrders,
                isHigher: +ordersPercent > 0
            }
        })

    } catch(e) {
        errorHandler(resp,e)
    }
}

module.exports.analytics = async function (req,resp) {
    try {
        //в порядке возростания сортируем
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        //сумму всех заказов делим на кол дней
        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2)

        const chart = Object.keys(ordersMap).map(label => {
            //label = 05.05.2005
            const gain = calculatePrice(ordersMap[label])
            const order = ordersMap[label].length

            return {label, order, gain}
        })

        resp.status(200).json({
            average,chart
        })

    } catch (e) {
        errorHandler(resp, e)
    }
}

function getOrdersMap(orders = []) {
    const daysOrder = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        //если будет совпадать с текущем днём то не будем делать какие либо операции
        //аналитика не делается на текущий день
        if(date === moment().format('DD.MM.YYYY')) {
            return
        }

        //создаем массив с ключём date
        if(!daysOrder[date]) {
            daysOrder[date] = []
        }

        //добавляем по ключу date заказ
        daysOrder[date].push(order)
    })

    return daysOrder
}

function calculatePrice(orders = []) {
    return orders.reduce((total,order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total+= orderPrice
    }, 0)
}

/*
* {
* '19.03.2021': [
* //order
* //order
* //order
* ]
* }
*
*
* */
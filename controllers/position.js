const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')
module.exports.getByCategoryId = async function (req,resp) {
    try {
        //ищем все позиции в базе по условиям
        const positions = await Position.find({
            //ищем по айди категории
            category: req.params.categoryId,
            //ищем по айдишнику пользователя (пользователя мы получаем от паспорта)
            user: req.user.id
        })
        resp.status(200).json(positions)
    } catch (e) {
        errorHandler(resp,e)
    }
}

//создаем новую позицию
module.exports.create = async function (req,resp) {
    try {
        const position = await new Position({
            //данная информация из входящего запроса приходит
            name: req.body.name,
            cost: req.body.cost,
            //айдишник категории
            category: req.body.category,
            //айдишник текущего пользователя у паспорта взятый
            user: req.user.id
        }).save()
        resp.status(201).json(position)
    } catch (e) {
        errorHandler(resp,e)
    }
}
module.exports.remove = async function (req,resp) {
    try {
        await Position.remove({_id: req.params.id})
        resp.status(200).json({
            message: 'Позиция была удалена'
        })
    } catch (e) {
        errorHandler(resp,e)
    }
}
module.exports.update = async function (req,resp) {
    try {
        const position = await Position.findOneAndUpdate(
            //находим по айдишнику взятого из параметров url
            {_id: req.params.id},
            //задаем переданное состояние
            {$set: req.body},
            //для того чтобы обновленные данные в базе сохранились
            {new: true}
            )

        resp.status(200).json(position)
    } catch (e) {
        errorHandler(resp,e)
    }
}

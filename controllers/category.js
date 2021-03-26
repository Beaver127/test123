//импортируем модели для работы с бд
const Category = require('../models/Category')
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req,resp) {
    try {
        //получаем все катергории которые создал пользователь
        //получаем через его айдишник(именно его созданные категории)
        //айдишник берём из паспорта с помощью которого мы вошли в систему и он
        //отдал нам пользователя
        const categories = await Category.find({
            user: req.user.id
        })
        //отдаём всех пользователей
        resp.status(200).json(categories)

    } catch (e) {
        errorHandler(resp,e)
    }
}

module.exports.getById = async function (req,resp) {
    try {
        //из передаваемых парамтров url берём id
        const category = await Category.findById(req.params.id)
        resp.status(200).json(category)
    } catch (e) {
        errorHandler(resp,e)
    }
}
module.exports.remove = async function (req,resp) {
    try {
        //удаляем категорию по айдишнику из базы
        await Category.remove({_id: req.params.id})
        //удаляем все позиции из базы по айдишнику категории так как позиции хранят уникальный
        //айдишник категории к которой они привязаны
        await Position.remove({category: req.params.id})

        resp.status(200).json({
            message: 'Категроия удалена.'
        })
    } catch (e) {
        errorHandler(resp,e)
    }
}

module.exports.create = async function (req,resp) {
    const category = new Category({
        name: req.body.name,
        user: req.user.id,
        //если у нас есть картинка то добавляем её путь
        imageSrc: req.file ? req.file.path : ''
    })
    try {
        await category.save()
        resp.status(201).json({category})
    } catch (e) {
        errorHandler(resp,e)
    }
}
module.exports.update = async function (req,resp) {
    try {
        const updated = {
            name: req.body.name
        }
        //если в реквесте есть файл то мы должны задать свойство расположения
        if(req.file) {
            updated.imageSrc = req.file.path
        }
        //обновляем категорию
        const category = await Category.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {$set: updated},
            {new: true}
            )
        resp.status(200).json(category)
    } catch (e) {
        errorHandler(resp,e)
    }
}
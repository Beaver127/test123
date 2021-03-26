//шифрование паролей
const bcrypt = require('bcryptjs')
//токен авторизации
const jwt = require('jsonwebtoken')
//модель пользваотелся для работы с бд
const User = require('../models/User')
//настройки конфигурации
const keys = require('../config/keys')
//универсальный метод обработки ошибки
const errorHandler = require('../utils/errorHandler')

//добавляем async для асинхронных запросов
module.exports.login = async function (req,resp) {
    //получаем данные с клиента а потом ищем пользователся по емайлу
    const candidate = await User.findOne({email: req.body.email})
    if(candidate) {
        //если нашли то асинхронно сверяем пароль \ шифруем
        // его и сверяем с закодированым шифром
        const passwordResult = bcrypt.compareSync(req.body.password,candidate.password)
        if(passwordResult) {
            //генерация токена (пароли совпали)
            const token = jwt.sign({
                //емаил
                email: candidate.email,
                //айдишник в базе
                userId: candidate._id,

            },
                //секретный ключ для токена
                keys.jwt,
                //валидеый на протяжении часа
                {expiresIn: 60 * 60})
            //отдаем токен сгенерированный
            resp.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            resp.status(401).json({
                message: 'Пароли не совпали'
            })
        }
    } else {
        resp.status(404).json({
            message: 'Пользователь с таким email не найден'
        })
    }
}

module.exports.register = async function (req,resp) {
    //пытаемся найти пользователя в бд по емайлу
   const candidate = await User.findOne({email: req.body.email})

    if(candidate) {
        resp.status(409).json({
            message: 'Такой email уже используется'
        })
    } else {
        //иначе создаем нового пользователя
        //доп защита
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        //новый пользователь
        const user = new User({
            email: req.body.email,
            //кодируем пароль
            password: bcrypt.hashSync(password,salt)
        })

        try {
            await user.save()
            resp.status(201).json(user)
        } catch (e) {
            errorHandler(resp,e)
        }
    }
}
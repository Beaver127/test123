//серв
const express = require('express')
//вход в систему
const passport = require('passport')
//для поиска файлов
const path = require('path')
//для работы с бд(сущности)
const mongoose = require('mongoose')
//для парсинга json
const bodyParser = require('body-parser')
const keys = require('./config/keys')
//импорт роутов
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const app = express()

//подключение к бд
mongoose.connect(keys.mongoURI)
    .then(() => {console.log("mongo connected")})
    .catch(error => console.log(error))

//инициализируем паспорт
app.use(passport.initialize())
//запускаем стратегии паспорта для защиты роутов
require('./middleware/passport')(passport)

//подключаем плагин расшифровки символов (безопасность от неизвестных символов)
app.use(bodyParser.urlencoded({extended:true}))
//парсинг json формата / поддержка json
app.use(bodyParser.json())
//для логов на серве
app.use(require('morgan')('dev'))
//делаем доступ к статике по такому url
app.use('/uploads', express.static('uploads'))
//для запросов пользователя
app.use(require('cors')())

//подключение роутов к серву
app.use("/api/auth", authRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/position", positionRoutes)



//если продакшн (если рабочий проект)
if(process.env.NODE_ENV === 'production') {
    //делаем статической папку с frontend частью
    app.use(express.static('client/dist/client'))

    //__dirname - текущая дериктория проекта
    app.get('*', (reg,resp) => {
        resp.sendFile(
            path.resolve(
                __dirname,
                'client',
                'dist',
                'client',
                'index.html'
            )
        )
    })
}



module.exports = app
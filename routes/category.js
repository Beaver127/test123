const express = require('express')
const router = express.Router()
const passport = require('passport')
const upload = require('../middleware/upload')
const controller = require('../controllers/category')

//запускаем аутентификацию через паспорт \ указываем jwt стратегию
//передаются данные о пользователе (его токен в котором лежит емайл \ айдишник \ секретный ключ) в функцию
//проверки токена через паспорт по стратегии JWT

//получение всех категорий
router.get("/",passport.authenticate('jwt',{session: false}), controller.getAll)
//получение категории по id (get)
router.get("/:id",passport.authenticate('jwt',{session: false}), controller.getById)
//удаление категории по id (delete)
router.delete("/:id",passport.authenticate('jwt',{session: false}), controller.remove)
//single - указываем что загружаем только один файл
//создание категории и загрузка файла картинки по имени image (post)
router.post("/",passport.authenticate('jwt',{session: false}),upload.single('image'), controller.create)
//обновление категории по id (patch)
router.patch("/:id",passport.authenticate('jwt',{session: false}),upload.single('image'), controller.update)

module.exports = router
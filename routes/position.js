const express = require('express')
const router = express.Router()
const controller = require('../controllers/position')
//для входа в систему
const passport = require('passport')

//получение позиции по id (get)
router.get("/:categoryId",passport.authenticate('jwt',{session: false}), controller.getByCategoryId)
//создание позиции (post)
router.post("/",passport.authenticate('jwt',{session: false}), controller.create)
//обновление позиции (patch)
router.patch("/:id",passport.authenticate('jwt',{session: false}), controller.update)
//удаление позиции по id (delete)
router.delete("/:id",passport.authenticate('jwt',{session: false}), controller.remove)

module.exports = router
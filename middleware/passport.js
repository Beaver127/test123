const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('../config/keys')

//опции для входа в систему
const options = {
    //токен
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //секретный ключ
    secretOrKey: keys.jwt
}

module.exports = passport => {
    //подключаем модуль к паспорту (один из способов входа в систему)
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try{
                //находим по айди а потом берём емаил и айдишник
                const user = await User.findById(payload.userId).select('email id')
                if(user) {
                    //возвращаем пользователя
                    //вход в систему успешен
                    done(null,user)
                } else {
                    //возвращаем false
                    done(null, false)
                }
            } catch (e) {
                console.log(e)
            }
        })
    )
}









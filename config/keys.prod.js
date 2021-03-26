//нужные значения (для различных настроек)
module.exports = {
    //подключение к бд
    mongoURI: process.env.MONGO_URI,
    //секретный ключ
    jwt: process.env.JWT
}
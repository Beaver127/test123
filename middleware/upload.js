//для загрузки файлов
const multer = require('multer')
//для удобного форматирования данных
const moment = require('moment')

const storage = multer.diskStorage({
    //указываем путь где будут хранится файлы
    //так же нужно создать папку uploads и файл .gitkeep для того чтобы не было
    //ошибок а файл для того чтобы не удалили папку
    destination(req, file, callback) {
        callback(null, 'uploads/')
    },
    //создание названия файла
    filename(req,file, callback) {
        // https://momentjs.com/docs/#/displaying/
        //день в формате 05,06,07,31
        //месяц в формате 05,06,07,12
        //год в формате 1968
        //часы в формате 00,01,02,23
        //минуты в формате 00,01,02,59
        //секунды в формате 00,01,02,59
        //милисекунды в формате 000,001... 998,999
        //дата и имя файла для избежания дублей и ошибок
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        callback(null, `${date}-${file.originalname}`)
    }
})

//фильтр загрузки файлов(фильтр - те которые можно сохранять)
const fileFilter = (reg,file,callback) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        //разрешаем
        callback(null,true)
    } else {
        //не разрешаем
        callback(null, false)
    }
}

//лимит макс размера файла

const limits = {
    //https://allcalc.ru/converter/bits-bytes
    //5 мегабайт
    fileSize: 1024 * 1024 * 5
}

//загрузчик, фильтр загрузки,макс размер файла
module.exports = multer({storage, fileFilter, limits})
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
*
* категория продукта у неё есть название \ картинка \ и id пользователя
* так же позиции а это услуги в данной категрии продукта
* кондитерские изделия - категория
* ромашка \ красный мак - позиции
*
* */


const categorySchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: '',
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('categories', categorySchema)
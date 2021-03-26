//експортируем стандартную функцию обработки ошибок
module.export = (resp,error) => {
    resp.status(500).json({
        success: false,
        message: error.message ? error.message : error
    })
}
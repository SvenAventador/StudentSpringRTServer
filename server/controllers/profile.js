const {
    extname,
    resolve
} = require("path");
const ErrorHandler = require("../errors/error");
const Validation = require('../func/validation')
const uuid = require("uuid");
const {Profile, User} = require("../database");
const moment = require("moment");

class ProfileController {
    async getOne(req, res, next) {
        const {id} = req.query
        try {
            const user = await User.findByPk(id)
            const profile = await Profile.findOne({where: {userId: user.id}})
            return res.json(profile)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {
            id,
            surname,
            name,
            patronymic,
            birthday,
            gender,
            phone,
            telegramLink,
            placeOfStudyOfWork,
        } = req.body

        let positionOrStudyDocument
        if (req.files && req.files.positionOrStudyDocument)
            positionOrStudyDocument = req.files.positionOrStudyDocument
        else
            positionOrStudyDocument = req.body.positionOrStudyDocument

        let documentImage = null
        if (req.files && req.files.positionOrStudyDocument) {
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
            const fileExtension = extname(positionOrStudyDocument.name).toLowerCase()

            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'))
            documentImage = uuid.v4() + fileExtension

            try {
                await positionOrStudyDocument.mv(resolve(__dirname, '..', 'static', 'img', documentImage))
            } catch (error) {
                return next(ErrorHandler.internal(`Произошла ошибка во время сохранения изображения: ${error}`))
            }
        }

        if (!Validation.isString(surname))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректную фамилию!'))
        if (!Validation.isString(name))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректную фамилию!'))

        const birthDate = moment(birthday, 'YYYY-MM-DD');
        const age = moment().diff(birthDate, 'years');
        if (age < 16)
            return next(ErrorHandler.badRequest('Возраст участника не может быть меньше 16 лет!'))
        if (age > 35)
            return next(ErrorHandler.badRequest('Возраст участника не может быть больше 35 лет!'))

        if (!['Мужской', 'Женский'].includes(gender))
            return next(ErrorHandler.conflict('Пожалуйста, выберите корректный пол!'))
        if (!telegramLink.startsWith('https://t.me/'))
            return next(ErrorHandler.conflict('Пожалуйста, введите корректную ссылку на аккаунт!'))
        if (!Validation.isString(placeOfStudyOfWork))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректное место работы!'))
        if (!Validation.isString(req.body.placeOfStudyOfWork))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректную должность!'))

        try {
            let profile = await Profile.findByPk(id)
            if (!profile || profile.telegramLink !== telegramLink) {
                const existingProfile = await Profile.findOne({where: {telegramLink}})
                if (existingProfile) {
                    return next(ErrorHandler.conflict('Пользователь с таким телеграмм аккаунтом уже существует!'))
                }
            }

            if (!profile || profile.phone !== phone) {
                const existingProfile = await Profile.findOne({where: {phone}})
                if (existingProfile) {
                    return next(ErrorHandler.conflict('Пользователь с таким номером телефона уже существует!'))
                }
            }

            const user = await User.findByPk(id)

            if (profile) {
                await profile.update({
                    id,
                    surname,
                    name,
                    patronymic,
                    birthday,
                    gender,
                    phone,
                    telegramLink,
                    placeOfStudyOfWork,
                    positionOrStudyDocument: documentImage || positionOrStudyDocument,
                    userId: user.id
                })
                return res.json(profile)
            } else {
                profile = await Profile.create({
                    id,
                    surname,
                    name,
                    patronymic,
                    birthday,
                    gender,
                    phone,
                    telegramLink,
                    placeOfStudyOfWork,
                    positionOrStudyDocument: documentImage || positionOrStudyDocument,
                    userId: user.id
                })
                return res.json(profile)
            }
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new ProfileController
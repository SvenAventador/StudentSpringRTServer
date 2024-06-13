const ErrorHandler = require("../errors/error");
const {
    Participant,
    ParticipantComment, User, Profile
} = require("../database");
const {
    extname,
    resolve
} = require("path");
const uuid = require("uuid");
const Validation = require("../func/validation");
const moment = require("moment/moment");

class ParticipantController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const participant = await Participant.findByPk(id)
            return res.json(participant)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        const {id} = req.query

        try {
            const participants = await Participant.findAll({
                where: {
                    profileId: id
                },
                include: [ParticipantComment]
            })
            return res.json(participants)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            surname,
            name,
            patronymic,
            birthday,
            gender,
            email,
            phone,
            telegramLink,
            placeOfStudyOfWork,
            specialization,
            participantStatusId,
            accountStatusId = 1,
            profileId
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
            documentImage = uuid.v4() + '.jpg'

            try {
                await positionOrStudyDocument.mv(resolve(__dirname, '..', 'static', 'img', documentImage))
            } catch (error) {
                return next(ErrorHandler.internal(`Произошла ошибка во время сохранения изображения: ${error}`))
            }
        }

        try {
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
            if (!Validation.isEmail(email))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную почту!'))
            if (!Validation.isString(placeOfStudyOfWork))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное место работы!'))
            if (!Validation.isString(specialization))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное место работы!'))
            if (!Validation.isString(req.body.placeOfStudyOfWork))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную должность!'))

            const existingTg = await Participant.findOne({where: {telegramLink}})
            if (existingTg)
                return next(ErrorHandler.conflict('Участник с таким телеграм аккаунтом уже существует!'))

            const existingEmail = await Participant.findOne({where: {email}})
            if (existingEmail)
                return next(ErrorHandler.conflict('Участник с такой почтой уже существует!'))
            const existringPhone = await Participant.findOne({where: {phone}})
            if (existringPhone)
                return next(ErrorHandler.conflict('Участник с таким телефоном уже существует!'))

            const profile = await Profile.findOne({where: {userId: profileId}})


            const participant = await Participant.create({
                surname,
                name,
                patronymic,
                birthday,
                gender,
                email,
                phone,
                telegramLink: telegramLink.startsWith('https://t.me/') ? telegramLink : 'https://t.me/' + telegramLink,
                placeOfStudyOfWork,
                specialization,
                positionOrStudyDocument: documentImage || positionOrStudyDocument,
                participantStatusId,
                accountStatusId,
                profileId: profile.id
            })

            return res.json(participant)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async update(req, res, next) {
        const {id} = req.query
        const {
            surname,
            name,
            patronymic,
            birthday,
            gender,
            email,
            phone,
            telegramLink,
            placeOfStudyOfWork,
            specialization,
            participantStatusId,
            accountStatusId,
            profileId
        } = req.body;

        let positionOrStudyDocument;
        if (req.files && req.files.positionOrStudyDocument) {
            positionOrStudyDocument = req.files.positionOrStudyDocument;
        } else {
            positionOrStudyDocument = req.body.positionOrStudyDocument;
        }

        let documentImage = null;
        if (req.files && req.files.positionOrStudyDocument) {
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const fileExtension = extname(positionOrStudyDocument.name).toLowerCase();

            if (!allowedImageExtensions.includes(fileExtension)) {
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: .jpg, .jpeg, .png или .gif!'));
            }
            documentImage = uuid.v4() + '.jpg';

            try {
                await positionOrStudyDocument.mv(resolve(__dirname, '..', 'static', 'img', documentImage));
            } catch (error) {
                return next(ErrorHandler.internal(`Произошла ошибка во время сохранения изображения: ${error}`));
            }
        }

        try {
            if (!Validation.isString(surname))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную фамилию!'))
            if (!Validation.isString(name))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное имя!'))

            const birthDate = moment(birthday, 'YYYY-MM-DD');
            const age = moment().diff(birthDate, 'years');
            if (age < 16)
                return next(ErrorHandler.badRequest('Возраст участника не может быть меньше 16 лет!'))
            if (age > 35)
                return next(ErrorHandler.badRequest('Возраст участника не может быть больше 35 лет!'))

            if (!['Мужской', 'Женский'].includes(gender))
                return next(ErrorHandler.conflict('Пожалуйста, выберите корректный пол!'))
            if (!Validation.isEmail(email))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную почту!'))
            if (!Validation.isString(placeOfStudyOfWork))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректное место работы!'))
            if (!Validation.isString(specialization))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную специализацию!'))
            if (!Validation.isString(req.body.placeOfStudyOfWork))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную должность!'))

            const participant = await Participant.findByPk(id)
            if (!participant) {
                return next(ErrorHandler.notFound('Участник не найден!'));
            }

            if (!participant || participant.email !== email) {
                const existingParticipant = await Participant.findOne({where: {email}})
                if (existingParticipant) {
                    return next(ErrorHandler.conflict('Пользователь с такой почтой уже существует!'))
                }
            }

            if (!participant || participant.telegramLink !== telegramLink) {
                const existingParticipant = await Participant.findOne({where: {telegramLink}})
                if (existingParticipant) {
                    return next(ErrorHandler.conflict('Пользователь с таким телеграмм аккаунтом уже существует!'))
                }
            }

            if (!participant || participant.phone !== phone) {
                const existingParticipant = await Participant.findOne({where: {phone}})
                if (existingParticipant) {
                    return next(ErrorHandler.conflict('Пользователь с таким номером телефона уже существует!'))
                }
            }

            await participant.update({
                surname,
                name,
                patronymic,
                birthday,
                gender,
                email,
                phone,
                telegramLink: telegramLink.startsWith('https://t.me/') ? telegramLink : 'https://t.me/' + telegramLink,
                placeOfStudyOfWork,
                specialization,
                positionOrStudyDocument: documentImage || positionOrStudyDocument,
                participantStatusId,
                accountStatusId,
                profileId,
            })

            return res.json(participant);
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }


    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const participant = await Participant.findByPk(id)
            await participant.destroy()
            return res.json({message: "Участник успешно удален!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async deleteAll(req, res, next) {
        const {profileId} = req.query
        try {
            const participants = await Participant.findAll({where: {profileId}})
            participants.map(async (participant) => {
                await participant.destroy()
            })

            return res.json({message: "Участники успешно удалены!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async saveParticipant(req, res, next) {
        const {profileId} = req.query

        try {
            await Participant.update({
                accountStatusId: 2
            }, {
                where: {
                    profileId
                }
            })
            return res.status(200).json({message: 'Статус участников успешно обновлен.'});
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }
}

module.exports = new ParticipantController()
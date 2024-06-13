const ErrorHandler = require("../errors/error");
const Validation = require("../func/validation");
const {
    Application,
    ApplicationParticipant,
    ApplicationTechnicalGroup,
    Nomination,
    FormOfParticipation,
    Participant,
    Direction,
    ApplicationStatus,
    Profile, ApplicationComment
} = require("../database");
const moment = require("moment");
const {
    Op,
    Sequelize,
    col
} = require("sequelize");

class ApplicationController {
    async getOne(req, res, next) {
        const {id} = req.query
        try {
            const application = await Application.findByPk(id, {
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    }
                ]
            })

            return res.json({application})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        const {profileId} = req.query
        try {
            const profile = await Profile.findOne({where: {userId: profileId}})
            const allVocal = await Application.findAll({
                where: {
                    directionId: 1,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    },
                    {
                        model: ApplicationComment
                    }
                ]
            })
            const allInstrumental = await Application.findAll({
                where: {
                    directionId: 2,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    }
                ]
            })
            const allDances = await Application.findAll({
                where: {
                    directionId: 3,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    }
                ]
            })
            const allTheatre = await Application.findAll({
                where: {
                    directionId: 4,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    }
                ]
            })
            const allOriginalGenre = await Application.findAll({
                where: {
                    directionId: 5,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    }
                ]
            })
            const allFashion = await Application.findAll({
                where: {
                    directionId: 6,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    }
                ]
            })
            const allMedia = await Application.findAll({
                where: {
                    directionId: 7,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    }
                ]
            })
            const allVideo = await Application.findAll({
                where: {
                    directionId: 8,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    }
                ]
            })
            const allArt = await Application.findAll({
                where: {
                    directionId: 9,
                    profileId: profile.id,
                    [Op.and]: [
                        Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                    ]
                },
                include: [
                    {
                        model: Nomination
                    },
                    {
                        model: FormOfParticipation
                    },
                    {
                        model: Direction
                    },
                    {
                        model: ApplicationParticipant,
                        include: Participant
                    },
                    {
                        model: ApplicationTechnicalGroup,
                        include: Participant
                    },
                    {
                        model: ApplicationStatus
                    }
                ]
            })

            return res.json(
                {
                    allVocal,
                    allInstrumental,
                    allDances,
                    allTheatre,
                    allOriginalGenre,
                    allFashion,
                    allMedia,
                    allVideo,
                    allArt
                }
            )
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            name,
            duration,
            category,
            googleCloudLink,
            contactPerson,
            phoneContactPerson,
            telegramContactPerson,
            fioDirector,
            teamName,
            applicationStatusId = 1,
            profileId,
            directionId,
            nominationId,
            formParticipationId,
            team,
            tech
        } = req.body

        if (!Validation.isString(name))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректное название номера!'))
        const existingName = await Application.findOne({where: {name}})
        if (existingName)
            return next(ErrorHandler.conflict('Данное название уже сущесвутет в системе. Пожалуйста, придумайте другое название!'))
        const existingTeamName = await Application.findOne({where: {teamName}})
        console.log(existingTeamName)
        if (parseInt(formParticipationId) !== 1 &&  existingTeamName)
            return next(ErrorHandler.conflict('Коллектив с таким названием уже участвует!'))
        if (!moment(duration, 'mm:ss', true).isValid() &&
            (moment.duration(duration, 'mm:ss').asMinutes() <= 0 ||
            moment.duration(duration, 'mm:ss').asMinutes() >= 15)) {
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректную продолжительность номера! Продолжительность номера не более 15 минут!'));
        }
        if (!['Профильная', 'Непрофильная'].includes(category))
            return next(ErrorHandler.badRequest('Пожалуйста, выберите корректную категорию номера!'))
        if (!Validation.isString(googleCloudLink) || !googleCloudLink.includes('https://drive.google.com/drive/'))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректную ссылку на Google Cloud (Гугл Диск)!'))
        if (!Validation.isString(contactPerson) || contactPerson.split(' ').length < 2)
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректное ФИО контактного лица!'))
        if (!Validation.isString(fioDirector) || fioDirector.split(' ').length < 2)
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректное ФИО руководителя!'))

        const profile = await Profile.findOne({where: {userId: profileId}})
        try {
            const application = await Application.create({
                name,
                duration,
                category,
                googleCloudLink,
                contactPerson,
                phoneContactPerson,
                telegramContactPerson: telegramContactPerson.startsWith('https://t.me/') ? telegramContactPerson : 'https://t.me/' + telegramContactPerson,
                fioDirector,
                teamName: teamName ?? null,
                profileId: profile.id,
                applicationStatusId,
                directionId,
                nominationId,
                formParticipationId
            })

            if (team && !Array.isArray(team)) {
                await ApplicationParticipant.create({
                    participantId: team,
                    applicationId: application.id
                })
            }

            if (tech && !Array.isArray(tech)) {
                await ApplicationTechnicalGroup.create({
                    participantId: tech,
                    applicationId: application.id
                })
            }

            if (team && Array.isArray(team)) {
                console.log('РАБОТАЕТ')
                const teamPromise = team.map(async (memberId) => {
                    await ApplicationParticipant.create({
                        participantId: memberId,
                        applicationId: application.id
                    })
                })

                await Promise.all(teamPromise)
            }

            if (tech && Array.isArray(tech)) {
                const techPromise = tech.map(async (memberId) => {
                    await ApplicationTechnicalGroup.create({
                        participantId: memberId,
                        applicationId: application.id
                    })
                })

                await Promise.all(techPromise)
            }

            return res.json(application)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            name,
            duration,
            category,
            googleCloudLink,
            contactPerson,
            phoneContactPerson,
            telegramContactPerson,
            fioDirector,
            teamName,
            applicationStatusId,
            profileId,
            directionId,
            nominationId,
            formParticipationId,
            team,
            tech
        } = req.body

        if (!Validation.isString(name))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректное название номера!'))
        if (!moment(duration, 'mm:ss', true).isValid())
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректную продолжительность номера!'))
        if (!['Профильная', 'Непрофильная'].includes(category))
            return next(ErrorHandler.badRequest('Пожалуйста, выберите корректную категорию номера!'))
        if (!Validation.isString(googleCloudLink) || !googleCloudLink.includes('https://drive.google.com/drive/'))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректную ссылку на Google Cloud (Гугл Диск)!'))
        if (!Validation.isString(contactPerson) || contactPerson.split(' ').length < 2)
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректное ФИО контактного лица!'))
        if (!Validation.isString(telegramContactPerson) || !telegramContactPerson.includes('https://t.me/'))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректную ссылку на Telegram аккаунт!'))
        if (!Validation.isString(fioDirector) || fioDirector.split(' ').length < 2)
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректное ФИО руководителя!'))

        try {
            const existingApplication = await Application.findByPk(id)
            if (!existingApplication)
                return next(ErrorHandler.notFound('Заявка не найдена!'))

            if (!existingApplication || existingApplication.name !== name) {
                const existingName = await Application.findOne({where: {name}})
                if (existingName) {
                    return next(ErrorHandler.conflict('Номер с таким названием уже существует!'))
                }
            }

            if (!existingApplication || existingApplication.teamName !== teamName) {
                const existingName = await Application.findOne({where: {teamName}})
                if (existingName) {
                    return next(ErrorHandler.conflict('Коллектив с таким названием уже участвует!'))
                }
            }

            await existingApplication.update({
                name,
                duration,
                category,
                googleCloudLink,
                contactPerson,
                phoneContactPerson,
                telegramContactPerson,
                fioDirector,
                teamName,
                applicationStatusId,
                profileId,
                directionId,
                nominationId,
                formParticipationId
            })

            if (team) {
                await ApplicationParticipant.destroy({where: {applicationId: existingApplication.id}})

                if (Array.isArray(team)) {
                    const teamPromise = team.map(async (memberId) => {
                        await ApplicationParticipant.create({
                            participantId: memberId,
                            applicationId: existingApplication.id
                        })
                    })
                    await Promise.all(teamPromise)
                } else {
                    await ApplicationParticipant.create({
                        participantId: team,
                        applicationId: existingApplication.id
                    })
                }
            }

            if (tech) {
                await ApplicationTechnicalGroup.destroy({where: {applicationId: existingApplication.id}})

                if (Array.isArray(tech)) {
                    const techPromise = tech.map(async (memberId) => {
                        await ApplicationTechnicalGroup.create({
                            participantId: memberId,
                            applicationId: existingApplication.id
                        })
                    })
                    await Promise.all(techPromise)
                } else {
                    await ApplicationTechnicalGroup.create({
                        participantId: tech,
                        applicationId: existingApplication.id
                    })
                }
            }

            return res.json(existingApplication)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const application = await Application.findByPk(id)
            await application.destroy()
            return res.json({message: 'Номер успешно удален!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        const {profileId} = req.query

        try {
            const applications = await Application.findAll({where: {profileId}})
            applications.map(async (application) => {
                await application.destroy()
            })
            return res.json({message: 'Номер успешно удален!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async saveApplication(req, res, next) {
        const {profileId} = req.query

        try {
            await Application.update({
                applicationStatusId: 2
            }, {
                where: {
                    profileId
                }
            })
            return res.status(200).json({message: 'Статус номеров успешно обновлен.'});
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }
}

module.exports = new ApplicationController()
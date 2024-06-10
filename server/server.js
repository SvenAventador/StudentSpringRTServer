require('dotenv').config()
const PORT = process.env.PORT || 5000

const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')

const routes = require('./routes/routes')
const errorMiddleware = require('./middlewares/error')

const database = require('./database/db')
require('./database/index')
const {
    AccountStatus,
    ApplicationStatus,
    Direction,
    Nomination,
    FormOfParticipation,
    ParticipantStatus,
    Role
} = require("./database");

const app = express()
app.use(express.json())
app.use(cors())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static', 'img')))
app.use(express.static(path.resolve(__dirname, 'static', 'files')))

app.use('/api', routes)

app.use(errorMiddleware)

const start = async () => {
    try {
        await database.authenticate()
        await database.sync()

        const accountOrApplicationStatuses = [
            'Черновик',
            'На проверке',
            'Отклонено',
            'Принято'
        ]
        for (const status of accountOrApplicationStatuses) {
            await AccountStatus.findOrCreate({
                where: {status}
            })
        }
        for (const status of accountOrApplicationStatuses) {
            await ApplicationStatus.findOrCreate({
                where: {status}
            })
        }

        const participantStatuses = [
            'Участник',
            'Техническая группа',
            'Руководитель коллектива'
        ]
        for (const status of participantStatuses) {
            await ParticipantStatus.findOrCreate({
                where: {status}
            })
        }

        const forms = [
            'Соло',
            'Малые составы (дуэт, трио, квартет, квинтет) (2-5 чел.)',
            'Большие составы (от 6 чел.)'
        ]
        for (const form of forms) {
            await FormOfParticipation.findOrCreate({
                where: {form}
            })
        }

        const roles = [
            'Участник',
            'Администратор',
            'Проверяющий'
        ]
        for (const role of roles) {
            await Role.findOrCreate({
                where: {role}
            })
        }
        const directionData = [
            {
                direction: 'Вокальное',
                nominations: [
                    'Народное пение',
                    'Академическое пение',
                    'Эстрадное пение',
                    'Джазовое пение',
                    'Авторская песня',
                    'Рэп',
                    'Бит-бокс',
                    'ВИА'
                ]
            },
            {
                direction: 'Инструментальное',
                nominations: [
                    'Народные инструменты',
                    'Струнные инструменты',
                    'Клавишные инструменты',
                    'Духовые инструменты',
                    'Ударные инструменты',
                    'Смешанные ансамбли',
                    'Электронная музыка и диджеинг'
                ]
            },
            {
                direction: 'Танцевальное',
                nominations: [
                    'Народный танец',
                    'Эстрадный танец (в том числе стилизация народного танца)',
                    'Современный танец',
                    'Экспериментальная хореография',
                    'Уличный танец',
                    'Бально-спортивный танец',
                    'Классический танец'
                ]
            },
            {
                direction: 'Театральное',
                nominations: [
                    'Художественное слово',
                    'Авторское художественное слово',
                    'Фронтовая поэзия',
                    'Эстрадный монолог',
                    'Эстрадная миниатюра',
                    'Театр малых форм',
                    'СТЭМ на антикоррупционную тематику'
                ]
            },
            {
                direction: 'Оригинальный жанр',
                nominations: [
                    'Цирковое искусство',
                    'Оригинальный номер',
                    'Пантомима',
                    'Иллюзия',
                    'Синтез-номер',
                    'Искусство сценического костюма (Перфоманс)',
                    'Чир данс шоу'
                ]
            },
            {
                direction: 'Мода',
                nominations: [
                    'Готовое к носке (Ready-to-wear) и Спортивная мода (Sport)',
                    'Концептуальная мода (Alternative) и мода мегаполисов (Urban)',
                    'Мода с элементами «этно»',
                    'Вечерняя мода'
                ]
            },
            {
                direction: 'Медиа',
                nominations: [
                    'Видеорепортаж',
                    'Аудиоподкаст',
                    'Публикация',
                    'Фотопроект',
                    'SMM и продвижение в социальных сетях (Вконтакте)'
                ]
            },
            {
                direction: 'Видео',
                nominations: [
                    'Музыкальный клип',
                    'Юмористический ролик',
                    'Короткометражный фильм',
                    'Документальный ролик',
                    'Рекламный ролик'
                ]
            },
            {
                direction: 'Арт',
                nominations: [
                    'Графический дизайн',
                    'Моушн-дизайн',
                    'Кастомизация'
                ]
            }
        ]

        for (const data of directionData) {
            const { direction, nominations } = data;

            if (!direction || !Array.isArray(nominations)) {
                console.error(`Invalid direction data: ${JSON.stringify(data)}`);
                continue;
            }

            const [dir, created] = await Direction.findOrCreate({
                where: { direction }
            })

            if (created) {
                const directionId = dir.id
                const nominationsToCreate = nominations.map((nomination) => ({
                    nomination,
                    directionId: directionId
                }))

                await Nomination.bulkCreate(nominationsToCreate)
            }
        }


        await app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`)
        })
    } catch (error) {
        console.error(`Server encountered an error: ${error}`)
    }
}

start().then(() => {
    console.log('Server started successfully!')
}).catch((error) => {
    console.error(`Server find next error: ${error}`)
})
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
    Role, User
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

        const userAdmin = [
            {
                email: "adminAccount1@gmail.com",
                password: "$2b$05$DL/gZ1.GbnAV7VpmMvZVEeyBc/tM3OXDYLjP61v8SXHJR.QYnzxMy"
            },
            {
                email: "adminAccount2@gmail.com",
                password: "$2b$05$ec6mrsLM6FJTIp9VUxyYcu95bTUCZC.8hSY3b5a9Nh3TuYHU8KmWm"
            },
            {
                email: "adminAccount3@gmail.com",
                password: "$2b$05$97rVOsGs2FsUuj8QkubA9eJTfcGP4ArvpkXdPIOS0FAq/CPaycxwe"
            },
            {
                email: "adminAccount4@gmail.com",
                password: "$2b$05$XVctNMb9oatXJw8FmltiBORNsq/XLUz83jbjJ3sbKkWx0UuHa0gX2"
            },
            {
                email: "adminAccount5@gmail.com",
                password: "$2b$05$ZN7GrznhR5A/J0O/9nGJ3u8S5lqkeWBjupTvPFnKAJw2dVqEA6Jae"
            },
            {
                email: "adminAccount6@gmail.com",
                password: "$2b$05$/eNqDE1Q/hzTa8aBo3SyBeA5gDXEIkX9PPa/RscOkv3xDiJWsw/lK"
            },
            {
                email: "adminAccount7@gmail.com",
                password: "$2b$05$roinLXOH8e5der.942sCMuAHFzDbDXgsfWWTMNG4i5a2pHHxHsJoi"
            },
            {
                email: "adminAccount8@gmail.com",
                password: "$2b$05$WAo4GUHGVmwlh/aF9nqIoO/MyQRgM/PFUV6JevUhuS3.zlVNtmoyO"
            },
            {
                email: "adminAccount9@gmail.com",
                password: "$2b$05$k/1V6ZBIQMVQTkN1QcdZyOYg6gCpTTv5HlA/fGxgJ5ctfPvFWKhOW"
            },
            {
                email: "adminAccount10@gmail.com",
                password: "$2b$05$.v307z/AcAFcGX2QqPupIOgO0DUZVtggql.DNF1s0J4c1QPXk/Xky"
            },
            {
                email: "adminAccount11@gmail.com",
                password: "$2b$05$ZZawB7pUDkqzzI62DDM3uuqN71X0hysIWbFyRXHYodoqLMLdQN.Fe"
            },
            {
                email: "adminAccount12@gmail.com",
                password: "$2b$05$1YXg53/jiMvtlOEPGBONje3o0PL0V5AwBtAcQqtxPxIY3NsECiqQC"
            },
            {
                email: "adminAccount13@gmail.com",
                password: "$2b$05$ePjXhNNT61QRqqPUEk/uPup0i/4HwYe3YIP698IWGoLL1okfsRLva"
            },
            {
                email: "adminAccount14@gmail.com",
                password: "$2b$05$OA0VaN.snFPFvFvUONFRQ.3KBoDeLN/9/zQOB7YFTqM4OBiCaQYji"
            },
            {
                email: "adminAccount15@gmail.com",
                password: "$2b$05$XsEzxPdNlVl9bL8f4S0zyuDqs/7/ku3vYqkVxbcEv42r6X9QKswfi"
            }
        ];

        const userInspector = [
            {
                email: "inspectorAccount1@gmail.com",
                password: "$2b$05$OEdkdBiG/ai3h2G6A9kTBubMTkxnVqoofU0aVsRF6rWCaZwagEk4y"
            },
            {
                email: "inspectorAccount2@gmail.com",
                password: "$2b$05$r2OcG9Rhj7J6cIZvASgJR.bcG/6jugHrLRArLwD21aP4zb7.899v2"
            },
            {
                email: "inspectorAccount3@gmail.com",
                password: "$2b$05$.E6KCsChKY3Qq/s.7.JNXem8zHmEKsmw3uKoIiXakBucovO4QMA82"
            },
            {
                email: "inspectorAccount4@gmail.com",
                password: "$2b$05$fQASF1aG2szV1Np6r48e/.YfDRx446tOUdKW7wITXSutrridFMcra"
            },
            {
                email: "inspectorAccount5@gmail.com",
                password: "$2b$05$9txAg6AqImFl3OEG3bA1duifiNwVdbegCdYRHCuTq8xoa1htfU27G"
            },
            {
                email: "inspectorAccount6@gmail.com",
                password: "$2b$05$oAzr8hhL4chdRvTepBVYq.7u13.gnGjx/JzBZEXD1eI4JVu2xfg4S"
            },
            {
                email: "inspectorAccount7@gmail.com",
                password: "$2b$05$TVpw5spRu10ieBNTKDZ/hu/fHKPRNBi5BXf5nOBScQdeBc7Gxl2QG"
            },
            {
                email: "inspectorAccount8@gmail.com",
                password: "$2b$05$TucCgv0.2NuXw5WJDz9miOAxPn6zCszO877WFZkpzPhpAOHZGG7q."
            },
            {
                email: "inspectorAccount9@gmail.com",
                password: "$2b$05$lEUD7SWvnI9OKmtqo0OareE0SKrLoWlvUDMUi.GDU8gfrP8lnNyj2"
            },
            {
                email: "inspectorAccount10@gmail.com",
                password: "$2b$05$gLW/fCQxfVuKtYk1izUwx.465/zohJo3wHLS5r42q3zoavnbHJFIq"
            },
            {
                email: "inspectorAccount11@gmail.com",
                password: "$2b$05$1rW13NlsIubiUSErDrxDYuKArO8P3lef/jXW8plbLM9tkONK03lvO"
            },
            {
                email: "inspectorAccount12@gmail.com",
                password: "$2b$05$cnlVYRsDivyXajxa0.zhNOyC1NPVFL5okcTDAAFWnVCt6AB.10zCW"
            },
            {
                email: "inspectorAccount13@gmail.com",
                password: "$2b$05$7vPRALIEjmKloM88H3CvHeOBRzWAKlWITz4H6QqNgX02G04ziHfcm"
            },
            {
                email: "inspectorAccount14@gmail.com",
                password: "$2b$05$J79GT6SSZDECl7rHrfoqyujxgYLuWRFc.3ZOoHKAGXjaKdkIh.7hm"
            },
            {
                email: "inspectorAccount15@gmail.com",
                password: "$2b$05$EfiKpdu0Vqo1AO08ENBA1.n/fpmA.kcx2Raz4MmuYyyXrgiwDAGSO"
            }
        ];

        try {
            for (const user of userAdmin) {
                await User.create({
                    email: user.email,
                    password: user.password,
                    roleId: 2
                });
            }
            console.log('Users have been seeded successfully');
        } catch (error) {
            console.error('Error seeding users:', error);
        }

        try {
            for (const inspector of userInspector) {
                await User.create({
                    email: inspector.email,
                    password: inspector.password,
                    roleId: 3
                });
            }
            console.log('Inspector accounts have been seeded successfully');
        } catch (error) {
            console.error('Error seeding inspector accounts:', error);
        }
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
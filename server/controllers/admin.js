const ErrorHandler = require("../errors/error");
const {Profile, Participant, AccountStatus, ParticipantComment, Application, ApplicationParticipant,
    ApplicationTechnicalGroup, ApplicationComment, ApplicationStatus,
    Nomination,
    FormOfParticipation,
    Direction,
    ApplicationDocument, AdminDocument
} = require("../database");
const {Op, Sequelize, col} = require("sequelize");
const {
    TableRow,
    TableCell,
    Paragraph,
    TextRun,
    AlignmentType,
    Document,
    PageOrientation,
    Table,
    Packer
} = require("docx");
const Validation = require("../func/validation");
const uuid = require("uuid");
const {join} = require("path");
const fs = require("fs");
const moment = require("moment/moment");

class AdminController {
    async getAllProfile(req, res, next) {
        try {
            const profile = await Profile.findAll({
                include: [
                    {
                        model: Participant,
                        include: [
                            {
                                model: AccountStatus
                            },
                            {
                                model: ParticipantComment
                            }
                        ]
                    }
                ]
            })

            return res.json(profile)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async getAllApplication(req, res, next) {
        try {
            const profile = await Profile.findAll({
                include: [
                    {
                        model: Application,
                        include: [
                            {
                                model: ApplicationParticipant,
                                include: [Participant]
                            },
                            {
                                model: ApplicationTechnicalGroup,
                                include: [Participant]
                            },
                            {
                                model: ApplicationComment
                            },
                            {
                                model: ApplicationStatus
                            }
                        ]
                    }
                ]
            })

            return res.json(profile)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async changeAccountStatus(req, res, next) {
        const {
            id,
            accountStatusId,
        } = req.query

        const {
            status
        } = req.body

        try {
            const participant = await Participant.findByPk(id);
            if (!participant) {
                return res.status(404).json({message: 'Участник не найден'});
            }

            participant.accountStatusId = accountStatusId;
            await participant.save();

            if (parseInt(participant.accountStatusId) === 3) {
                const existingComment = await ParticipantComment.findOne({
                    where: {
                        participantId: id
                    }
                });
                if (existingComment) {
                    existingComment.status = status;
                    await existingComment.save();
                } else {
                    await ParticipantComment.create({
                        status: status,
                        participantId: participant.id
                    })
                }
            }

            return res.status(200).json({message: 'Статус участника успешно изменен'});
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }
    async changeApplicationStatus(req, res, next) {
        const {
            id,
            applicationStatusId,
        } = req.query

        const {
            status
        } = req.body

        try {
            const application = await Application.findByPk(id);
            if (!application) {
                return res.status(404).json({message: 'Заявки не найдено'});
            }

            application.applicationStatusId = applicationStatusId;
            await application.save();

            if (parseInt(application.applicationStatusId) === 3) {
                console.log('лох')
                const existingComment = await ApplicationComment.findOne({
                    where: {
                        applicationId: id
                    }
                });

                if (existingComment) {
                    existingComment.status = status;
                    await existingComment.save();
                } else {
                    await ApplicationComment.create({
                        status: status,
                        applicationId: application.id
                    })
                }
            }

            return res.status(200).json({message: 'Статус заявки успешно изменен'});
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async createDocument(req, res, next) {
        const {profileId, userId} = req.query;
        try {
            const directions = [
                {id: 1, name: 'Вокальное'},
                {id: 2, name: 'Инструментальное'},
                {id: 3, name: 'Танцевальное'},
                {id: 4, name: 'Театральное'},
                {id: 5, name: 'Оригинальный жанр'},
                {id: 6, name: 'Мода'},
                {id: 7, name: 'Медиа'},
                {id: 8, name: 'Видео'},
                {id: 9, name: 'Арт'}
            ];

            const allVocal = await Application.findAndCountAll({
                where: {
                    directionId: 1,
                    profileId: profileId
                },
                include: [
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

            const allApplications = await Promise.all(directions.map(direction =>
                Application.findAll({
                    where: {
                        directionId: direction.id,
                        profileId: profileId,
                        [Op.and]: [
                            Sequelize.where(col('application_participants'), { [Op.ne]: null }),
                            Sequelize.where(col('application_technical_groups'), { [Op.ne]: null })
                        ]
                    },
                    include: [
                        {model: Nomination},
                        {model: FormOfParticipation},
                        {model: Direction},
                        {
                            model: ApplicationParticipant,
                            include: Participant
                        },
                        {
                            model: ApplicationTechnicalGroup,
                            include: Participant
                        },
                        {model: ApplicationStatus}
                    ]
                })
            ));

            const rows = [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({text: '№ п/п', size: 28})],
                                alignment: AlignmentType.CENTER
                            })]
                        }),
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: 'Фамилия, имя, отчество',
                                    size: 28
                                })], alignment: AlignmentType.CENTER
                            })]
                        }),
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: 'Дата рождения',
                                    size: 28
                                })], alignment: AlignmentType.CENTER
                            })]
                        }),
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: 'Направление подготовки / Специальность',
                                    size: 28
                                })], alignment: AlignmentType.CENTER
                            })]
                        }),
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: 'Номер телефона',
                                    size: 28
                                })], alignment: AlignmentType.CENTER
                            })]
                        }),
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({
                                    text: 'Подпись на согласие на обработку персональных данных*',
                                    size: 24
                                })], alignment: AlignmentType.CENTER
                            })]
                        }),
                    ]
                })
            ];

            allApplications.forEach((applications, dirIndex) => {
                if (applications.length > 0) {
                    const direction = directions[dirIndex];
                    rows.push(new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({
                                        text: `Направление: «${direction.name}»`,
                                        size: 28,
                                        font: "Times New Roman",
                                    })]
                                })],
                                columnSpan: 6
                            })
                        ]
                    }));

                    applications.forEach((app, appIndex) => {
                        const collectiveName = app.form_participation.form === 'Соло' ? `${app.application_participants[0].participant.surname || ''} ${app.application_participants[0].participant.name || ''} ${app.application_participants[0].participant.patronymic || ''}` : app.teamName;
                        rows.push(new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({
                                        children: [new TextRun({
                                            text: `${app.form_participation.form === 'Соло' ? collectiveName : `«${collectiveName}»`}, ${app.nomination.nomination} (${app.form_participation.form}), «${app.name}»`,
                                            size: 28,
                                            font: "Times New Roman",
                                            italics: true
                                        })],
                                        alignment: AlignmentType.CENTER
                                    })],
                                    columnSpan: 6
                                })
                            ]
                        }));

                        app.application_participants.forEach((participant, partIndex) => {
                            rows.push(new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: `${partIndex + 1}.`,
                                                size: 28,
                                                font: "Times New Roman"
                                            })],
                                            alignment: AlignmentType.LEFT
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: `${participant.participant?.surname || ''} ${participant.participant?.name || ''} ${participant.participant?.patronymic || ''}`,
                                                size: 28,
                                                font: "Times New Roman"
                                            })]
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: `${participant.participant?.birthday || ''}`,
                                                size: 28,
                                                font: "Times New Roman"
                                            })]
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: `${participant.participant?.specialization || ''}`,
                                                size: 28,
                                                font: "Times New Roman"
                                            })]
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: `${participant.participant?.phone || ''}`,
                                                    size: 28,
                                                    font: "Times New Roman"
                                                })
                                            ]
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: '',
                                                size: 28,
                                                font: "Times New Roman"
                                            })]
                                        })]
                                    })
                                ]
                            }))
                        });
                    });

                    rows.push(new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({
                                        text: `Данные руководителей, технической группы, аккомпаниаторов, дирижеров **`,
                                        size: 28,
                                        font: "Times New Roman",
                                        italics: true
                                    })]
                                })],
                                columnSpan: 6
                            })
                        ]
                    }));

                    applications.forEach((app, appIndex) => {
                        app.application_technical_groups.forEach((participant, partIndex) => {
                            rows.push(new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: `${partIndex + 1}.`,
                                                size: 28,
                                                font: "Times New Roman"
                                            })],
                                            alignment: AlignmentType.LEFT
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: `${participant.participant?.surname || ''} ${participant.participant?.name || ''} ${participant.participant?.patronymic || ''}`,
                                                size: 28,
                                                font: "Times New Roman"
                                            })]
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: `${participant.participant?.birthday || ''}`,
                                                size: 28,
                                                font: "Times New Roman"
                                            })]
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: `${participant.dataValues.participant.dataValues.positionOrStudyDocumen || ''}`,
                                                size: 28,
                                                font: "Times New Roman"
                                            })]
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: `${participant.participant?.phone}`,
                                                    size: 28,
                                                    font: "Times New Roman"
                                                })
                                            ]
                                        })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({
                                                text: '',
                                                size: 28,
                                                font: "Times New Roman"
                                            })]
                                        })]
                                    })
                                ]
                            }))
                        });
                    });
                }
            });

            const doc = new Document({
                sections: [{
                    properties: {
                        page: {
                            margin: {top: 1440, bottom: 1440, left: 2160, right: 1044},
                            size: {orientation: PageOrientation.LANDSCAPE}
                        }
                    },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            indent: 0,
                            children: [new TextRun({
                                text: "Приложение 2.2",
                                bold: true,
                                font: "Times New Roman",
                                size: 28
                            })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            indent: 0,
                            children: [new TextRun({
                                text: "к Положению о проведении",
                                font: "Times New Roman",
                                size: 28
                            })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            indent: 0,
                            children: [new TextRun({
                                text: "XIII Республиканского фестиваля студенческого творчества",
                                font: "Times New Roman",
                                size: 28
                            })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            indent: 0,
                            children: [new TextRun({
                                text: "«Студенческая весна Республики Татарстан»",
                                font: "Times New Roman",
                                size: 28
                            })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            indent: 0,
                            children: [new TextRun({
                                text: "образовательных организаций высшего образования в 2024 году",
                                font: "Times New Roman",
                                size: 28
                            })]
                        }),
                        new Paragraph({children: [new TextRun({text: "", size: 28})]}),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {line: 276},
                            children: [new TextRun({text: "Общий список участников", size: 28})]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {line: 276},
                            children: [new TextRun({
                                text: "XIII Республиканского фестиваля студенческого творчества ",
                                size: 28,
                                bold: true
                            })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {line: 276},
                            children: [new TextRun({
                                text: "«Студенческая весна Республики Татарстан»",
                                size: 28,
                                bold: true
                            })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {line: 276},
                            children: [new TextRun({
                                text: "образовательных организаций высшего образования в 2024 году",
                                size: 28,
                                bold: true
                            })]
                        }),
                        new Paragraph({children: [new TextRun({text: "", size: 28})]}),
                        new Paragraph({
                            children: [new TextRun({
                                text: "Образовательная организация: РМОО «Лига студентов Республики Татарстан»",
                                size: 28
                            })]
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: "ФИО и контактный номер ответственного лица: ",
                                size: 28
                            }), new TextRun({
                                text: " Хуснеева Саина Рафисовна",
                                size: 28,
                                underline: {}
                            }), new TextRun({text: ' +7-917-907-55-83', size: 28})]
                        }),
                        new Paragraph({children: [new TextRun({text: "", size: 28})]}),
                        new Table({rows: rows}),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: '* Персональные данные предоставляются в соответствии с Федеральным законом от 1 марта 2023 г. № 152-ФЗ «О персональных данных» ',
                                    size: 24
                                }),
                                new TextRun({
                                    text: 'и должны содержать в том числе следующую информацию: фамилия, имя, отчество, дата рождения, место обучения (наименование ',
                                    size: 24
                                }),
                                new TextRun({
                                    text: 'образовательной организации), номер мобильного телефона участника, почта, творческие направления, в которых принимает участие.',
                                    size: 24
                                })
                            ],
                            spacing: {
                                line: 276
                            },
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: '** Данные руководителей, технической группы, аккомпаниаторов, дирижеров, моделей указываются после каждого номера\\работы, где',
                                    size: 24
                                }),
                                new TextRun({
                                    text: 'необходимо их участие',
                                    size: 24
                                })
                            ],
                            spacing: {
                                line: 276
                            },
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: '',
                                    size: 28,
                                    font: "Times New Roman"
                                })
                            ]
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: `Количество поданных заявок (творческих номеров) и количество участников по направлениям:`,
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 1),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 2),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 3),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 4),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 5),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 6),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 7),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 8),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getCountData(profileId, 9),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [new TextRun({
                                text: await Validation.getAllTotal(profileId),
                                size: 28,
                                font: "Times New Roman"
                            })],
                            spacing: {line: 276},
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Ответственное лицо",
                                    size: 28,
                                    font: "Times New Roman"
                                }),
                                new TextRun({
                                    text: 'ㅤㅤㅤㅤㅤㅤㅤㅤ',
                                    size: 28,
                                    font: "Times New Roman"
                                }),
                                new TextRun({
                                    text: 'Хуснеева С.Р.',
                                    size: 28,
                                    font: "Times New Roman",
                                    underline: true
                                }),
                                new TextRun({
                                    text: 'ㅤㅤㅤㅤㅤ',
                                    size: '28',
                                    font: "Times New Roman",
                                }),
                                new TextRun({
                                    text: 'ㅤㅤㅤㅤㅤ',
                                    size: '28',
                                    font: "Times New Roman",
                                    underline: true
                                }),
                                new TextRun({
                                    text: 'ㅤㅤㅤㅤㅤ',
                                    size: '28',
                                    font: "Times New Roman",
                                }),
                                new TextRun({
                                    text: 'ㅤㅤㅤㅤㅤㅤ',
                                    size: '28',
                                    font: "Times New Roman",
                                    underline: true
                                })
                            ],
                            alignment: AlignmentType.LEFT
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ(подпись) ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ(дата)',
                                    size: '18',
                                    font: "Times New Roman",
                                }),
                            ]
                        })
                    ]
                }]
            });

            const buffer = await Packer.toBuffer(doc);
            const fileName = uuid.v4() + '.docx'
            const outputDir = join(__dirname, '..', 'static', 'files');
            const outputFile = join(outputDir, fileName);
            fs.writeFileSync(outputFile, buffer);

            await AdminDocument.create({
                userId: userId,
                profileId: profileId,
                document: fileName
            })

            res.send('Документ создан');
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async getDocument(req, res, next) {
        try {
            const {userId} = req.query

            const documents = await AdminDocument.findAll({
                where: {
                    userId: userId
                },
                include: [Profile]
            })

            return res.json(documents)
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async editProfile(req, res, next) {
        const { id, phone, telegramLink } = req.body;

        try {
            const profile = await Profile.findByPk(id);

            if (!profile) {
                return next(ErrorHandler.notFound('Профиль не найден'));
            }

            await profile.update({
                phone: phone,
                telegramLink: telegramLink,
            });

            return res.json(profile);
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async editParticipant(req, res, next) {
        const { id, email, phone, telegramLink } = req.body;

        try {
            const participant = await Participant.findByPk(id);

            if (!participant) {
                return next(ErrorHandler.notFound('Участник не найден'));
            }

            await participant.update({
                email: email,
                phone: phone,
                telegramLink: telegramLink,
            });
            return res.json(participant);

        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`));
        }
    }

    async editApplication(req, res, next) {
        const {id} = req.query
        const {
            name,
            contactPerson,
            phoneContactPerson,
            telegramContactPerson,
            fioDirector,
            teamName,
            formParticipationId,
            team,
            tech
        } = req.body

        if (!Validation.isString(name))
            return next(ErrorHandler.badRequest('Пожалуйста, введите корректное название номера!'))
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
                contactPerson,
                phoneContactPerson,
                telegramContactPerson,
                fioDirector,
                teamName,
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
}

module.exports = new AdminController()
const jwt = require('jsonwebtoken')
const {Application, ApplicationParticipant, Participant, ApplicationTechnicalGroup, Direction} = require("../database");

class Validation {
    static isString(value) {
        return typeof value === "string"
    }

    static isEmpty(value) {
        return value.trim() === ''
    }

    static isObject(value) {
        return typeof value === "object"
    }

    static isEmptyObject(value) {
        return !Object.keys(value).length
    }

    static isNumber(value) {
        return typeof value === "number"
    }

    static isEmail(value) {
        const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu
        return regex.test(value)
    }

    static isPassword(value) {
        return value.length >= 8
    }

    static isPhone(phone) {
        const regex = /^(\+7|8)?\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

        if (!this.isEmpty(phone) && this.isString(phone))
            return regex.test(phone)
        else return false
    }

    static isDate(value) {
        if (typeof value !== 'string') {
            return false;
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(value);
    }

    static isTime(value) {
        if (typeof value !== 'string') {
            return false
        }

        const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        return timeRegex.test(value);
    }

    static generate_jwt(
        id,
        userEmail,
        userRole
    ) {
        const payload = {
            id,
            userEmail,
            userRole
        }

        return jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY, {
                expiresIn: '24h'
            })
    }

    static getCountData = async (profileId, directionId) => {
        const direction = await Direction.findByPk(directionId);
        const data = await Application.findAndCountAll({
            where: {
                profileId: profileId,
                directionId: directionId
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
        });

        const dataCount = await Application.findAll({
            where: {
                profileId: profileId,
                directionId: directionId
            }
        })

        let totalParticipants = 0;
        let totalTechnicalGroups = 0;

        if (data && data.rows) {
            data.rows.forEach(application => {
                totalParticipants += application.application_participants.length || 0;
                totalTechnicalGroups += application.application_technical_groups.length || 0;
            });
        }
        const participantAmount = totalParticipants + totalTechnicalGroups
        return `- «${direction.direction}»: ${dataCount.length || 0} ${data.count === 0 ? 'заявок' : data.count === 1 ? 'заявка' : data.count >=2 && data.count <= 4 ? 'заявки' : 'заявок'}, ${participantAmount || 0} ${participantAmount === 0 ? 'участников' : participantAmount === 1 ? 'участник' : participantAmount >= 2 && participantAmount <= 4 ? 'участника' : 'участников'};`;
    }

    static getAllTotal = async (profileId) => {
        const data = await Application.findAndCountAll({
            where: {
                profileId: profileId,
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
        });

        const dataCount = await Application.findAll({where: {profileId}})

        let totalParticipants = 0;
        let totalTechnicalGroups = 0;

        if (data && data.rows) {
            data.rows.forEach(application => {
                totalParticipants += application.application_participants.length || 0;
                totalTechnicalGroups += application.application_technical_groups.length || 0;
            });
        }

        const participantAmount = totalParticipants + totalTechnicalGroups
        return `Всего ${dataCount.length || 0} ${dataCount.length === 0 ? 'заявок' : dataCount.length === 1 ? 'заявка' : dataCount.length >=2 && dataCount.length <= 4 ? 'заявки' : 'заявок'}, ${participantAmount || 0} ${participantAmount === 0 ? 'участников' : participantAmount === 1 ? 'участник' : participantAmount >= 2 && participantAmount <= 4 ? 'участника' : 'участников'}.`;
    }
}

module.exports = Validation

const Validation = require("../func/validation")
const ErrorHandler = require("../errors/error")
const bcrypt = require("bcrypt")
const {
    User,
    Role, Profile
} = require("../database")

class AuthController {
    async registration(req, res, next) {
        try {
            const {
                email,
                password,
                roleId = 1
            } = req.body

            if (!(Validation.isString(email)) || !(Validation.isEmail(email)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную почту!'))

            if (!(Validation.isString(password)) || !(Validation.isPassword(password)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный пароль! Минимальная длина пароля должна быть 8 символов'))

            const candidateOnEmail = await User.findOne({where: {email}})
            if (candidateOnEmail) {
                return next(ErrorHandler.conflict(`Пользователь с почтой ${email} уже существует!`))
            }

            const user = await User.create({
                email,
                password: await bcrypt.hash(password, 5),
                roleId
            })

            await Profile.create({
                userId: user.id
            })

            const role = await Role.findByPk(roleId)
            const token = Validation.generate_jwt(
                user.id,
                email,
                role.role
            )

            return res.json({token})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async login(req, res, next) {
        try {
            const {
                email,
                password
            } = req.body

            if (!(Validation.isString(email)) || !(Validation.isEmail(email)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректную почту!'))

            if (!(Validation.isString(password)) || !(Validation.isPassword(password)))
                return next(ErrorHandler.badRequest('Пожалуйста, введите корректный пароль! Минимальная длина пароля должна быть 8 символов'))

            const candidate = await User.findOne({where: {email}})
            if (!candidate) {
                return next(ErrorHandler.conflict(`Пользователя с почтой ${email} не существует!`))
            }

            if (!(bcrypt.compareSync(password, candidate.password))) {
                return next(ErrorHandler.conflict('Вы ввели неправильный пароль!'))
            }

            const role = await Role.findByPk(candidate.roleId)
            const token = Validation.generate_jwt(
                candidate.id,
                candidate.email,
                role.role
            )

            return res.json({token})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }

    async check(req, res, next) {
        const token = Validation.generate_jwt(
            req.user.id,
            req.user.userEmail,
            req.user.userRole
        )

        return res.json({token})
    }

    async logout(req, res, next) {
        const token = req.headers.authorization
        if (!token)
            return next(ErrorHandler.unauthorized("Пользователь не авторизован!"))

        try {
            return res.json({message: "Вы успешно вышли из системы!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Непредвиденная ошибка: ${error}`))
        }
    }
}

module.exports = new AuthController()
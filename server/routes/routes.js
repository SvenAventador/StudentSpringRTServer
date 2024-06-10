const Router = require('express')
const router = new Router()

const authRoutes = require('./auth')
const profileRoutes = require('./profile')
const participantRoutes = require('./participant')
const statusesRoutes = require('./statuses')
const applicationRoutes = require('./application')
const applicationDataRoutes = require('./applicationData')
const documentRoutes = require('./document')
const adminRoutes = require('./admin')

router.use('/user', authRoutes)
router.use('/profile', profileRoutes)
router.use('/participant', participantRoutes)
router.use('/statuses', statusesRoutes)
router.use('/application', applicationRoutes)
router.use('/application/data', applicationDataRoutes)
router.use('/document', documentRoutes)
router.use('/admin', adminRoutes)

module.exports = router

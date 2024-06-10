const AccountStatus = require("./models/AccountStatus");
const Application = require("./models/Application");
const ApplicationComment = require("./models/ApplicationComment");
const AdminDocument = require("./models/AdminDocument");
const ApplicationParticipant = require("./models/ApplicationParticipant");
const ApplicationTechnicalGroup = require("./models/ApplicationTechnicalGroup");
const Direction = require("./models/Direction");
const FormOfParticipation = require("./models/FormOfParticipation");
const Nomination = require("./models/Nomination");
const Participant = require("./models/Participant");
const ParticipantComment = require("./models/ParticipantComment");
const ParticipantStatus = require("./models/ParticipantStatus");
const Profile = require("./models/Profile");
const Role = require('./models/Role')
const User = require("./models/User");
const ApplicationStatus = require("./models/ApplicationStatus");
const ApplicationDocument = require("./models/ApplicationDocument");

Role.hasMany(User);
User.belongsTo(Role);

User.hasOne(Profile);
Profile.belongsTo(User);

ParticipantStatus.hasMany(Participant);
Participant.belongsTo(ParticipantStatus);

AccountStatus.hasMany(Participant);
Participant.belongsTo(AccountStatus);

ApplicationStatus.hasMany(Application)
Application.belongsTo(ApplicationStatus)

Participant.hasMany(ParticipantComment);
ParticipantComment.belongsTo(Participant);

Profile.hasMany(Participant);
Participant.belongsTo(Profile);

Profile.hasMany(Application);
Application.belongsTo(Profile);

Direction.hasMany(Application);
Application.belongsTo(Direction);

Direction.hasMany(Nomination);
Nomination.belongsTo(Direction);

Nomination.hasMany(Application);
Application.belongsTo(Nomination);

FormOfParticipation.hasMany(Application);
Application.belongsTo(FormOfParticipation);

Application.hasMany(ApplicationComment);
ApplicationComment.belongsTo(Application);

Application.hasMany(ApplicationParticipant)
ApplicationParticipant.belongsTo(Application)

Participant.hasMany(ApplicationParticipant)
ApplicationParticipant.belongsTo(Participant)

Profile.hasMany(ApplicationDocument)
ApplicationDocument.belongsTo(Profile)

User.hasMany(AdminDocument)
AdminDocument.belongsTo(User)

Profile.hasMany(AdminDocument)
AdminDocument.belongsTo(Profile)

Application.hasMany(ApplicationTechnicalGroup)
ApplicationTechnicalGroup.belongsTo(Application)

Participant.hasMany(ApplicationTechnicalGroup)
ApplicationTechnicalGroup.belongsTo(Participant)

module.exports = {
    AccountStatus,
    Application,
    ApplicationComment,
    ApplicationDocument,
    AdminDocument,
    ApplicationParticipant,
    ApplicationStatus,
    ApplicationTechnicalGroup,
    Direction,
    FormOfParticipation,
    Nomination,
    Participant,
    ParticipantComment,
    ParticipantStatus,
    Profile,
    Role,
    User
}
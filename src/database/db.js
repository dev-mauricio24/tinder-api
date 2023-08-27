import { Sequelize } from "sequelize";

import UserModel from '../models/User.js';
import SkillModel from '../models/Skill.js';
import CompanyModel from '../models/Company.js';
import ServiceModel from '../models/Service.js';

// Conection Database
const sequelize = new Sequelize(process.env.POSTGRES_URL);

UserModel(sequelize);
CompanyModel(sequelize);
SkillModel(sequelize);
ServiceModel(sequelize);

const { User, Company, Service, Skill } = sequelize.models;

//Model Relationships
// relation many to many between users and skills
User.belongsToMany(Skill, { through: "users_skills" });
Skill.belongsToMany(User, { through: "users_skills" });

// Relation many to one between Services and users.
// An user has many services while a service contains an unique user.
User.hasMany(Service, {
  foreignKey: 'user_id',
  sourceKey: 'id'
})

Service.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id'
})

Company.hasMany(Service, {
  foreignKey: "company_id",
  sourceKey: "id",
});

Service.belongsTo(Company, {
  foreignKey: "company_id",
  targetId: "id",
});

export {
  sequelize,
  User,
  Company,
  Skill,
  Service
}
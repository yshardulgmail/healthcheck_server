const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', "timestamps"]
    }
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.applications = require("./applications.model.js")(sequelize, Sequelize);
db.jobs = require("./jobs.model.js")(sequelize, Sequelize);
db.jobs_logs = require("./jobs_logs.model.js")(sequelize, Sequelize);
db.batch_jobs = require("./batch_jobs.model.js")(sequelize, Sequelize);
db.app_status = require("./app_status.model.js")(sequelize, Sequelize);

module.exports = db;

const application = require("../models/applications.model");
module.exports = (sequelize, Sequelize) => {
  const AppStatus = sequelize.define("app_status", {
    app_id: {
      type: Sequelize.INTEGER,
      references: {
        model: application,
        key: 'app_id'
   
      }
    },
    check_time: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    }
  },{timestamps: false,
    createdAt: false,
    updatedAt: false,});

  return AppStatus;
};

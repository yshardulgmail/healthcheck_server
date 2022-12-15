const application = require("../models/applications.model");
module.exports = (sequelize, Sequelize) => {
  const AppStatus = sequelize.define("app_status", {
    app_id: {
      type: Sequelize.INTEGER,
      references: {
        // This is a reference to another model
        model: application,
   
        // This is the column name of the referenced model
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

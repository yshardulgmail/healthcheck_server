const db = require("../models");
const Applications = db.applications;
const AppStatus = db.app_status;


exports.findAllAppStatus = (req, res) => {
  // AppStatus.belongsTo(Applications, {foreignKey: 'app_id'});
  console.log(Applications);
  console.log(AppStatus);
  AppStatus.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving app_status."
      });
    });
};

exports.findAllApplications = (req, res) => {
  // AppStatus.belongsTo(Applications, {foreignKey: 'app_id'});
  console.log(Applications);
  console.log(AppStatus);
  Applications.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving applications."
      });
    });
};


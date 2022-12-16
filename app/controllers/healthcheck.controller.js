const db = require("../models");
const Applications = db.applications;
const AppStatus = db.app_status;
const sql = require("mssql");
const dbConfig = require("../config/db.config.js");

const sqlConfig = {
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  server: dbConfig.HOST,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    trustServerCertificate: true
  }
}

exports.findAllAppStatus = (req, res) => {
  sql.connect(sqlConfig, function (err) {
  
    if (err) console.log(err);

    var request = new sql.Request();
       
    request.query('select app.app_id APP_ID, app_name, app_url, server, check_time, status from applications app inner join app_status s on app.app_id = s.app_id', function (err, recordset) {
        
        if (err) console.log(err)


        res.send(recordset.recordsets[0]);
        
    });
  });
};

exports.findAllApplications = (req, res) => {
  Applications.hasMany(AppStatus, {foreignKey: 'app_id'})
  AppStatus.belongsTo(Applications, {foreignKey: 'app_id'});
  Applications.findAll({
    include: [{
      model: AppStatus,
      // where: {app_id: AppStatus.app_id},
      required: true
  }]
  })
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

exports.findApplications = (req, res) => {
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

exports.findAppStatus = (req, res) => {
  AppStatus.findAll()
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

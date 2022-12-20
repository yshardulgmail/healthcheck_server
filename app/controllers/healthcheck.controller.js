const db = require("../models");
const fetch = require("node-fetch");
const Applications = db.applications;
const AppStatus = db.app_status;
const sql = require("mssql");
const dbConfig = require("../config/db.config.js");
// const date = require('date-and-time');

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
    const manual = req.params.manual;
    if (err) console.log(err);

    var request = new sql.Request();

    request.query("select app.app_id APP_ID, app_name, app_url, server, format(check_time, 'hh:mm tt') as check_time, status from applications app inner join app_status s on app.app_id = s.app_id order by check_time", function (err, recordset) {

      if (err) console.log(err)
      const resultSet = [...recordset.recordsets[0]];

      if (manual == "true") {
        let current_time = "";
        request.query("select format(GETDATE(), 'hh:mm tt') as check_time", function (err, timeStr) {
          current_time = timeStr["recordset"][0]["check_time"];
          console.log(current_time);
        });

        Applications.findAll({
          raw: true,
        })
          .then((data) => {
            Promise.all(data.map(appData => {
              appUrl = appData["app_url"];
              return fetch(appUrl).then(res1 => res1.text())
                .then(text => {
                  let status = "DOWN";

                  // This is random status generator. Need to remove when app urls are working
                  // const statuses = ["UP", "DOWN"];
                  // let status = statuses[Math.floor(Math.random() * statuses.length)];
                  if (text.includes("UP") || text.toLowerCase().includes("running")) {
                    status = "UP";
                  }
                  const newAppData = {};
                  newAppData["APP_ID"] = appData["app_id"];
                  newAppData["app_name"] = appData["app_name"];
                  newAppData["app_url"] = appData["app_url"];
                  newAppData["server"] = appData["server"];
                  newAppData["check_time"] = current_time;
                  newAppData["status"] = status;
                  return newAppData;
                });
            })).then(data1 => {
              data1.map(newAppData => resultSet.push(newAppData));
              console.log(resultSet.length);
              res.send(resultSet);
            });
          });

      }
      else {
        res.send(resultSet);
      }
    });
  });
};

exports.findAllApplications = (req, res) => {
  Applications.hasMany(AppStatus, { foreignKey: 'app_id' })
  AppStatus.belongsTo(Applications, { foreignKey: 'app_id' });
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

exports.findApplicationStatus = (req, res) => {
  console.log(req.params.appId);
  Applications.findAll({
    where: { app_id: req.params.appId },
  })
    .then(data => {
      if (data.length > 0) {
        appUrl = data[0]["dataValues"]["app_url"]
        fetch(appUrl)
          .then(res => res.text())
          .then(text => {
            console.log("fetched", text)
            // let status = "DOWN";

            // This is random status generator. Need to remove when app urls are working
            const statuses = ["UP", "DOWN"];
            let status = statuses[Math.floor(Math.random() * statuses.length)];

            if (text.includes("UP") || text.toLowerCase().includes("running")) {
              status = "UP";
            }

            res.send('"status": "' + status + '"')
          });
      }
      else {
        throw Error("Application not found");
      }
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

exports.saveAppStatus = () => {
  Applications.findAll()
    .then(data => {

      for (const [key, value] of Object.entries(data)) {
        console.log(value["dataValues"]);
        appUrl = value["dataValues"]["app_url"]
        fetch(appUrl)
          .then(res => res.text())
          .then(text => {
            console.log("fetched")
            // let status = "DOWN";

            // This is random status generator. Need to remove when app urls are working
            const statuses = ["UP", "DOWN"];
            let status = statuses[Math.floor(Math.random() * statuses.length)];

            const nowTime = new Date();
            if (text.includes("UP") || text.toLowerCase().includes("running")) {
              status = "UP";
            }

            sql.connect(sqlConfig, function (err) {
              if (err) console.log(err);
              const request = new sql.Request();
              const date = new Date();
              let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
              const am_pm = date.getHours() >= 12 ? "PM" : "AM";
              hours = hours < 10 ? "0" + hours : hours;
              const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
              const time = hours + ":" + minutes + am_pm;
              const insertQuery = "insert into app_status values(" + value["dataValues"]["app_id"]
                + ", GETDATE(), '"
                + status + "')"
              request.query(insertQuery, function (err, recordset) {
                if (err) console.log(err)
                // res.send(recordset.recordsets[0]);
              });
              console.log(insertQuery);
            });
          });
      }
    })
    .catch(err => {
      throw err
    });
};

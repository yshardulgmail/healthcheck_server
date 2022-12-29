const db = require("../models");
const fetch = require("node-fetch");
const Applications = db.applications;
const Jobs = db.jobs;
const BatchJobs = db.batch_jobs;
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
};

exports.findAllAppStatus = (req, res) => {
	sql.connect(sqlConfig, function (err) {
		const manual = req.params.manual;
		if (err) console.log(err);

		var request = new sql.Request();

		request.query("select app.app_id APP_ID, app_name, app_url, server, check_time, status from applications app inner join app_status s on app.app_id = s.app_id order by check_time", function (err, recordset) {

			if (err) console.log(err)
			const resultSet = [...recordset.recordsets[0]];

			if (manual == "true") {
				let current_time = "";
				request.query("select GETDATE() as check_time", function (err, timeStr) {
					current_time = timeStr["recordset"][0]["check_time"];
					console.log(current_time);
				});

				Applications.findAll({
					raw: true,
				})
				.then((data) => {
					Promise.all(data.map(appData => {
						appUrl = appData["app_url"];
						return fetch(appUrl).then(res1 => {
							if (!res1.ok) {
								throw Error("Got HTTP Status: " + res1.status);
							}
							return res1.text();
						})
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
							})
							.catch(err => {
								const newAppData = {};
								newAppData["APP_ID"] = appData["app_id"];
								newAppData["app_name"] = appData["app_name"];
								newAppData["app_url"] = appData["app_url"];
								newAppData["server"] = appData["server"];
								newAppData["check_time"] = current_time;
								newAppData["status"] = "DOWN";
								return newAppData;
							});

					})).then(data1 => {
						data1.map(newAppData => resultSet.push(newAppData));
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
					let status = "DOWN";


					if (text.includes("UP") || text.toLowerCase().includes("running") || text.toLowerCase().includes("username")) {
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

// exports.saveAppStatus = (req, res) => {
//   Applications.findAll()
//     .then(data => {
//       const dbConn = new sql.ConnectionPool(sqlConfig, err => {
//         transaction = new sql.Transaction(dbConn);
//         transaction.begin()
//         .then(err => {
//           Promise.all(data.map(appData => {
//             appUrl = appData["app_url"];
//             return fetch(appUrl).then(res1 => {

//               for (const [key, value] of Object.entries(data)) {
//                 // console.log(value["dataValues"]);
//                 appUrl = value["dataValues"]["app_url"]
//                 let status = "DOWN";
//                 fetch(appUrl)
//                 .then(res => {
//                   if (!res.ok) {
//                     throw Error("Got HTTP Status: " + res.status);
//                   }
//                   return res.text();
//                 })
//                 .then(text => {
//                   console.log("fetched")
//                   if (text.includes("UP") || text.toLowerCase().includes("running") || text.toLowerCase().includes("username")) {
//                     status = "UP";
//                   }
//                   const request = new sql.Request(transaction);
//                   const insertQuery = "insert into app_status values(" + value["dataValues"]["app_id"]
//                     + ", GETDATE(), '"
//                     + status + "')"
//                   request.query(insertQuery, function (err, recordset) {
//                     if (err) console.log(err)
//                     // res.send(recordset.recordsets[0]);
//                   });
//                   return "OK";
//                 })
//                 .catch(err => {
//                   console.log(err);
//                   const insertQuery = "insert into app_status values(" + value["dataValues"]["app_id"]
//                     + ", GETDATE(), '"
//                     + status + "')"
//                   const request = new sql.Request(transaction);
//                   request.query(insertQuery, function (err, recordset) {
//                     if (err) console.log(err)
//                     // res.send(recordset.recordsets[0]);
//                   });
//                   console.log(insertQuery);

//                   return "NOT OK";
//                 });
//               }
//             });
//           }))
//           .then(retData =>{
//             console.log(retData);
//             transaction.commit(err => {
//               if (err) {
//                 console.log("Error in commit! Rolling back!!!!!!");
//                 transaction.rollback(err => {
//                   if (err) console.log("Error occurred in rolling back!!!!!!");
//                   console.log("Rolling back was successful!!!!!!");
//                 })
//               }
//               console.log("Transaction commited!!!!!!");
//               res && res.send("OK");
//             });
//             return "OK";
//           })
//         });
//       });
//     })
//     .catch(err => {
//       res && res.send("Not OK");
//       throw err
//     });
//   };

exports.saveAppStatus = (req, res) => {
	Applications.findAll()
	.then(data => {
		for (const [key, value] of Object.entries(data)) {
			// console.log(value["dataValues"]);
			appUrl = value["dataValues"]["app_url"]
			let status = "DOWN";
			fetch(appUrl)
			.then(res => {
				if (!res.ok) {
					throw Error("Got HTTP Status: " + res.status);
				}
				return res.text();
			})
			.then(text => {
				console.log("fetched")
				if (text.includes("UP") || text.toLowerCase().includes("running") || text.toLowerCase().includes("username")) {
					status = "UP";
				}

				sql.connect(sqlConfig, function (err) {
					if (err) console.log(err);
					const request = new sql.Request();
					const insertQuery = "insert into app_status values(" + value["dataValues"]["app_id"]
						+ ", GETDATE(), '"
						+ status + "')"
					request.query(insertQuery, function (err, recordset) {
						if (err) console.log(err)
						// res.send(recordset.recordsets[0]);
					});
					console.log(insertQuery);
				});
			})
			.catch(err => {
				console.log(err);
				sql.connect(sqlConfig, function (err) {
					if (err) console.log(err);
					const request = new sql.Request();
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

		res && res.send("OK");
	})
	.catch(err => {
		throw err
	});
};

exports.findAllJobs = (req, res) => {
	Jobs.findAll()
	.then(data => {
		res.send(data);
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred while retrieving jobs."
		});
	});
};

exports.updateJob = (req, res) => {
	const job_id = req.params.job_id;

	Jobs.update(req.body, {
		where: { id: job_id }
	})
	.then(num => {
		if (num == 1) {
			res.send({
				message: "Job was updated successfully."
			});
		} else {
			res.send({
				message: "Cannot update Job with id=${job_id}. Maybe job was not found or req.body is empty!"
			});
		}
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred while retrieving jobs."
		});
	});
};

exports.deleteJob = (req, res) => {
	const job_id = req.params.job_id;

	Jobs.destroy({
		where: { id: job_id }
	})
	.then(num => {
		if (num == 1) {
			res.send({
				message: "Job was deleted successfully."
			});
		} else {
			res.send({
				message: "Cannot delete Job with id=${job_id}. Maybe job was not found!"
			});
		}
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred while retrieving jobs."
		});
	});
};

exports.addJob = (req, res) => {
	Jobs.create(req.body)
	.then(data => {
		res.send(data);
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred while retrieving jobs."
		});
	});
};

exports.findAllBatchJobs = (req, res) => {
	BatchJobs.findAll()
	.then(data => {
		res.send(data);
	})
	.catch(err => {
		res.status(500).send({
			message:
				err.message || "Some error occurred while retrieving jobs."
		});
	});
};

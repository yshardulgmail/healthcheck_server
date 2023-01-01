module.exports = app => {
  const healthcheck = require("../controllers/healthcheck.controller.js");
  const mail = require("../controllers/healthcheck.mail.controller");
  const login = require("../controllers/healthcheck.login.controller");

  var router = require("express").Router();

  router.get("/appstatus/:manual", healthcheck.findAllAppStatus);
  // router.get("/application", healthcheck.findAllApplications);
  router.get("/appstatuses", healthcheck.findAppStatus);
  router.get("/applications", healthcheck.findApplications);
  router.get("/application/:appId", healthcheck.findApplicationStatus);
  router.get("/saveAppStatus", healthcheck.saveAppStatus);
  
  router.get("/jobs", healthcheck.findAllJobs);
  router.put("/jobs/:job_id", healthcheck.updateJob);
  router.delete("/jobs/:job_id", healthcheck.deleteJob);
  router.post("/jobs", healthcheck.addJob);

  router.get("/batchJobs", healthcheck.findAllBatchJobs);
  
  router.post("/sendMail", mail.sendMail);

  router.post("/checkUser", login.checkUser);

  app.use('/api/healthcheck', router);
};

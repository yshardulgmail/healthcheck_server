module.exports = app => {
  const healthcheck = require("../controllers/healthcheck.controller.js");

  var router = require("express").Router();

  router.get("/appstatus/:manual", healthcheck.findAllAppStatus);
  // router.get("/application", healthcheck.findAllApplications);
  router.get("/appstatuses", healthcheck.findAppStatus);
  router.get("/applications", healthcheck.findApplications);
  router.get("/application/:appId", healthcheck.findApplicationStatus);


  app.use('/api/healthcheck', router);
};

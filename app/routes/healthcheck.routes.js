module.exports = app => {
  const healthcheck = require("../controllers/healthcheck.controller.js");

  var router = require("express").Router();

  router.get("/appstatus", healthcheck.findAllAppStatus);
  router.get("/applications", healthcheck.findAllApplications);

  app.use('/api/healthcheck', router);
};

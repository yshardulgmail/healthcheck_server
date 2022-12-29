module.exports = (sequelize, Sequelize) => {
  const Jobs = sequelize.define("jobs", {
   
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    job_name: {
      type: Sequelize.STRING
    },
    job_url: {
      type: Sequelize.STRING
    },
    job_before: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    job_after: {
      type: Sequelize.STRING
    },
    sla: {
      type: Sequelize.STRING
    },
    server: {
      type: Sequelize.STRING
    },
    log_path: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    script_path: {
      type: Sequelize.STRING
    },
    app_name: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    command: {
      type: Sequelize.STRING
    },
    file_location: {
      type: Sequelize.STRING
    },
    info: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    splunk: {
      type: Sequelize.STRING
    }
  },
  { 
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });

  return Jobs;
};

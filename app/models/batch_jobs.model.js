module.exports = (sequelize, Sequelize) => {
  const BatchJobs = sequelize.define("batch_jobs", {
   
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    batch: {
      type: Sequelize.STRING
    },
    sla_slo: {
      type: Sequelize.STRING
    }
  },
  { 
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });

  return BatchJobs;
};

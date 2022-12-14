module.exports = (sequelize, Sequelize) => {
  const Applications = sequelize.define("applications", {
    timestamps: false,

  // If don't want createdAt
  createdAt: false,

  // If don't want updatedAt
  updatedAt: false,
    app_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    app_name: {
      type: Sequelize.STRING
    },
    app_url: {
      type: Sequelize.STRING
    },
    server: {
      type: Sequelize.STRING
    }
  });

  return Applications;
};

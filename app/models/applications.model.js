module.exports = (sequelize, Sequelize) => {
  const Applications = sequelize.define("applications", {
   
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
  },{ timestamps: false,
    createdAt: false,
    updatedAt: false});

  return Applications;
};

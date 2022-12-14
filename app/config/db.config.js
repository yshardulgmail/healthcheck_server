module.exports = {
  HOST: "9.30.248.181",
  PORT: "1433",
  USER: "SA",
  PASSWORD: "P@ssw0rd",
  DB: "healthcheck",
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

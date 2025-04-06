const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require(__dirname + "/../config/config.json")["development"];

const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
});

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== "index.model.js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    model.init(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

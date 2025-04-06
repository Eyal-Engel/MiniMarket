const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require(__dirname + "/../config/config.json")["development"];
const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage, // מיקום קובץ ה-DB
});

const db = {};

// קריאה לכל הקבצים בתיקיית המודלים
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js") // מתעלמים מהקובץ index.js עצמו
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    model.init(sequelize); // אם המודל משתמש ב-Class, יש לקרוא ל-init.
    db[model.name] = model; // אחסון המודל ב-db כך שניתן לגשת אליו
  });

// יצירת קשרים בין המודלים אם יש
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

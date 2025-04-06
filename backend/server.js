const express = require("express");
const dotenv = require("dotenv");
const db = require("./models/index.model.js");
const routes = require("./routes/routes.js");
const { addInitialStoreOwner } = require("./models/StoreOwner.model.js");

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", routes);

db.sequelize.sync({ force: false }).then(() => {
  addInitialStoreOwner();

  app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
  );
});

const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const routes = require("./routes/routes.js");
const db = require("./models/index.model.js");
const { addInitialStoreOwner } = require("./models/StoreOwner.model.js");

dotenv.config();

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", routes);

db.sequelize.sync({ force: false }).then(() => {
  addInitialStoreOwner();

  app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
  );
});

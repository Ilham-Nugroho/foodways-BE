const express = require("express");
const router = require("./src/routes");

const app = express();

app.use(express.json());

app.use("/api/v1", router);
app.use("/uploads", express.static("uploads"));

const port = 5000;
app.listen(port, () => {
  console.log("Server running on PORT " + port);
});

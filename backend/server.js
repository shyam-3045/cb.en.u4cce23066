const express = require("express");
const cors = require("cors");
require("dotenv").config();
const notificationRoutes = require("./routes/notifications");
const globalErrorMiddleware = require("./middleware/globalErrorMiddleWare");
const Log = require("./utils/logger");



const PORT = process.env.PORT || 3001;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST","PATCH"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/notifications", notificationRoutes);

app.use(globalErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
  Log("backend", "info", "route", `Server started on port ${PORT}`);
});

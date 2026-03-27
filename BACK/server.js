const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const connectDB = require("./config/database");

dotenv.config();
const app = express();

// MIDDLEWARES
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ROUTE TEST
app.get("/", (req, res) => {
  res.json({ message: "API Banque active" });
});

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/versements", require("./routes/versementRoutes"));
app.use("/api/audits", require("./routes/auditRoutes"));

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
  });
});

app.use((err, req, res, next) => {
  console.error(" ERROR:", err.message);
  res.status(500).json({
    success: false,
    error: "Erreur interne du serveur",
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(` Serveur lancé sur http://localhost:${PORT}`);
  });
};

startServer();

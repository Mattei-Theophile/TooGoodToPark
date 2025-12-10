require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { specs, swaggerUi } = require("./swagger");

const cors = require("cors");
const { Api } = require("./api/api");
const { apiLogger } = require("./services/logger");
const colors = require("colors");

const { authenticateToken } = require("./services/login/auth");

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// API request/response logging middleware (applies to all /api/* routes)
app.use("/api", apiLogger);
app.use("/uploads", express.static("uploads"));
app.disable("x-powered-by");

// Swagger UI setup with custom options
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Car Rental API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showCommonExtensions: true,
    },
  }),
);

const api = new Api(app);
api.start();

console.log(
  colors.cyan(
    "📚 Swagger documentation available at http://localhost:3000/api-docs",
  ),
);

app.listen(PORT, () => {
  console.log(colors.green(`✔ Server is running on port ${PORT}`));
  console.log(
    colors.yellow(`🌐 Frontend CORS allowed for: http://localhost:5173`),
  );
});

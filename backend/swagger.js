import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skill Share Marketplace API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Auto-load from route files
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

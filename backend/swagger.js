import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Skill Share Marketplace API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer" }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Auto-load from route files
};

const swaggerSpec = swaggerJSDoc(options);

// ---- Cleanup nulls from requestBody & parameters ----
if (swaggerSpec.paths) {
  for (const pathItem of Object.values(swaggerSpec.paths)) {
    for (const operation of Object.values(pathItem)) {
      // 1) Remove any requestBody that is exactly `null`
      if (operation.requestBody === null) {
        delete operation.requestBody;
        continue;
      }

      // 2) If requestBody exists, scrub out any null content entries
      if (operation.requestBody?.content) {
        for (const [mime, mediaTypeObject] of Object.entries(operation.requestBody.content)) {
          if (mediaTypeObject == null) {
            delete operation.requestBody.content[mime];
          }
        }
        // If that leaves `content` empty, drop the whole requestBody
        if (Object.keys(operation.requestBody.content).length === 0) {
          delete operation.requestBody;
        }
      }

      // 3) Filter out any null parameters
      if (Array.isArray(operation.parameters)) {
        operation.parameters = operation.parameters.filter(p => p != null);
      }
    }
  }
}

export const setupSwaggerDocs = (app) => {
  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve raw JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

import express from 'express';
import cors from 'cors';
import "dotenv/config";

import { setupSwaggerDocs } from './swagger.js';

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Skill Share Marketplace API');
}
);

setupSwaggerDocs(app);
console.log(`Swagger docs availble at http://localhost:${PORT}/api-docs`);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}
);
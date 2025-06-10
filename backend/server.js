import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { setupSwaggerDocs } from './swagger.js';

import accountRouter from './routes/account.routes.js';
import offerRouter   from './routes/offer.routes.js';
import taskRouter    from './routes/task.routes.js';
import skillRouter   from './routes/skill.routes.js';
import progressRouter from './routes/progress.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', accountRouter);
app.use('/api', offerRouter);
app.use('/api', taskRouter);
app.use('/api', skillRouter);
app.use('/api', progressRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Skill Share Marketplace API');
});

setupSwaggerDocs(app);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;

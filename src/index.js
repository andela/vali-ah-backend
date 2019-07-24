import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import Debug from 'debug';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import swaggerDoc from '../docs/swagger';
import errorHandler from './middlewares/errorHandler';

config();

const debug = Debug('dev');
const { PORT } = process.env;
const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

app.use('/api/v1', routes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/', (request, response) => {
  response.status(200).send('1kbIdeas');
});

app.all('*', (request, response) => {
  response.status(404).send('Not Found');
});

app.use(errorHandler);

app.listen(PORT, () => debug(`Server started on port ${PORT}`));

export default app;

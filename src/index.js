import express, { json, urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import Debug from 'debug';
import swaggerUi from 'swagger-ui-express';
import validator from 'express-validator';
import passport from 'passport';
import session from 'express-session';

import routes from './routes';
import swaggerDoc from '../docs/swagger';
import errorHandler from './middlewares/errorHandler';

config();

const debug = Debug('dev');
const { PORT } = process.env;
const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(validator());
app.use(cors());
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use('/api/v1', routes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/', (request, response) => {
  response.status(200).json({
    status: 'success',
    message: 'Welcome to 1kbIdeas'
  });
});

app.all('*', (request, response) => {
  response.status(404).json({
    status: 'error',
    error: 'Not Found'
  });
});

app.use(errorHandler);

app.listen(PORT, () => debug(`Server started on port ${PORT}`));

export default app;
